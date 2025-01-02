import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Stil sabitleri
const STYLES = {
  header: {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } }, // Mavi
    alignment: { vertical: 'middle', horizontal: 'center' }
  },
  subHeader: {
    font: { bold: true, size: 12 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } }
  },
  currency: {
    numberFormat: '#,##0.00 ₺',
    alignment: { horizontal: 'right' }
  },
  percentage: {
    numberFormat: '#,##0.00%',
    alignment: { horizontal: 'right' }
  }
};

export const createStockExcel = async (data: any) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Stok Takip Sistemi';
  workbook.created = new Date();

  // Genel Özet Sayfası
  const summarySheet = workbook.addWorksheet('Genel Özet');
  summarySheet.columns = [
    { header: 'Metrik', key: 'metric', width: 30 },
    { header: 'Değer', key: 'value', width: 20 }
  ];

  // Başlık stilini uygula
  summarySheet.getRow(1).eachCell(cell => {
    Object.assign(cell, STYLES.header);
  });

  const summaryData = [
    { metric: 'Toplam Stok Değeri', value: data.stockValue.total },
    { metric: 'Toplam Ürün Sayısı', value: data.stockValue.byCategory.reduce((sum: number, cat: any) => sum + cat.productCount, 0) },
    { metric: 'Toplam Kategori Sayısı', value: data.stockValue.byCategory.length },
    { metric: 'Kritik Stok Ürün Sayısı', value: data.lowStock.length }
  ];

  summaryData.forEach((item, index) => {
    const row = summarySheet.addRow(item);
    if (index === 0) {
      row.getCell('value').numFmt = '#,##0.00 ₺';
    }
    row.font = { size: 12 };
  });

  // Kategori Dağılımı Sayfası
  const categorySheet = workbook.addWorksheet('Kategori Dağılımı');
  categorySheet.columns = [
    { header: 'Kategori', key: 'category', width: 30 },
    { header: 'Ürün Sayısı', key: 'count', width: 15 },
    { header: 'Toplam Değer', key: 'value', width: 20 },
    { header: 'Oran', key: 'percentage', width: 15 }
  ];

  // Başlık stilini uygula
  categorySheet.getRow(1).eachCell(cell => {
    Object.assign(cell, STYLES.header);
  });

  data.stockValue.byCategory.forEach((category: any) => {
    const row = categorySheet.addRow({
      category: category.categoryName,
      count: category.productCount,
      value: category.value,
      percentage: category.value / data.stockValue.total
    });

    // Para birimi formatı
    row.getCell('value').numFmt = '#,##0.00 ₺';
    // Yüzde formatı
    row.getCell('percentage').numFmt = '%#,##0.00';
  });

  // Düşük Stoklu Ürünler Sayfası
  const lowStockSheet = workbook.addWorksheet('Düşük Stoklu Ürünler');
  lowStockSheet.columns = [
    { header: 'Ürün Adı', key: 'name', width: 30 },
    { header: 'Kategori', key: 'category', width: 20 },
    { header: 'Stok', key: 'stock', width: 15 },
    { header: 'Birim Fiyat', key: 'price', width: 20 },
    { header: 'Toplam Değer', key: 'total', width: 20 }
  ];

  // Başlık stilini uygula
  lowStockSheet.getRow(1).eachCell(cell => {
    Object.assign(cell, STYLES.header);
  });

  data.lowStock.forEach((product: any) => {
    const row = lowStockSheet.addRow({
      name: product.name,
      category: product.category.name,
      stock: product.quantity,
      price: product.price,
      total: product.price * product.quantity
    });

    // Para birimi formatı
    row.getCell('price').numFmt = '#,##0.00 ₺';
    row.getCell('total').numFmt = '#,##0.00 ₺';

    // Kritik stok vurgusu
    if (product.quantity <= 10) {
      row.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFECACA' }
        };
      });
    }
  });

  // Ürün Dağılımı Sayfası
  const productSheet = workbook.addWorksheet('Ürün Dağılımı');
  productSheet.columns = [
    { header: 'Kategori', key: 'category', width: 25 },
    { header: 'Ürün Adı', key: 'name', width: 30 },
    { header: 'SKU', key: 'sku', width: 15 },
    { header: 'Stok', key: 'stock', width: 12 },
    { header: 'Birim Fiyat', key: 'price', width: 15 },
    { header: 'Toplam Değer', key: 'total', width: 15 },
    { header: 'Stok Durumu', key: 'status', width: 15 }
  ];

  // Başlık stilini uygula
  productSheet.getRow(1).eachCell(cell => {
    Object.assign(cell, STYLES.header);
  });

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { category: { name: 'asc' } }
  });

  let currentCategory = '';
  products.forEach((product, index) => {
    // Kategori değiştiğinde alt başlık ekle
    if (currentCategory !== product.category.name) {
      currentCategory = product.category.name;
      const categoryRow = productSheet.addRow([product.category.name]);
      categoryRow.eachCell(cell => {
        Object.assign(cell, STYLES.subHeader);
      });
    }

    const totalValue = product.price * product.quantity;
    const stockStatus = product.quantity <= 10 ? 'Kritik' : 
                       product.quantity <= 20 ? 'Düşük' : 'Normal';
    
    const row = productSheet.addRow({
      category: '',  // Kategori başlıkta olduğu için boş
      name: product.name,
      sku: product.sku,
      stock: product.quantity,
      price: product.price,
      total: totalValue,
      status: stockStatus
    });

    // Para birimi formatı
    row.getCell('price').numFmt = '#,##0.00 ₺';
    row.getCell('total').numFmt = '#,##0.00 ₺';

    // Stok durumuna göre renklendirme
    const statusCell = row.getCell('status');
    if (stockStatus === 'Kritik') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } };
    } else if (stockStatus === 'Düşük') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
    }
  });

  // Tüm sayfalara filtre ekle
  [categorySheet, lowStockSheet, productSheet].forEach(sheet => {
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: sheet.columnCount }
    };
  });

  return await workbook.xlsx.writeBuffer();
}; 