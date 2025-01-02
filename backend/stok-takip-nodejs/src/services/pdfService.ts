import PDFDocument from 'pdfkit-table';

export const createStockReport = async (data: any) => {
  const doc = new PDFDocument({
    margins: { top: 50, bottom: 50, left: 40, right: 40 },
    size: 'A4'
  });

  const chunks: Buffer[] = [];

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.rect(0, 0, doc.page.width, 100)
       .fill('#f8fafc');

    doc.fontSize(24)
       .fillColor('#1e293b')
       .text('Stok Raporu', 40, 40, { align: 'center' });
    
    doc.fontSize(11)
       .fillColor('#64748b')
       .text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 40, 70, { align: 'center' });

    // Kategori tablosu
    const categoryTable = {
      title: "Kategori Bazli Dagilim",
      headers: ["Kategori", "Ürün Sayisi", "Toplam Deger", "Oran"],
      rows: data.stockValue.byCategory.map((category: any) => {
        const percentage = ((category.value / data.stockValue.total) * 100).toFixed(1);
        return [
          category.categoryName,
          category.productCount.toString(),
          new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(category.value),
          `%${percentage}`
        ];
      })
    };

    // Düşük stok tablosu
    const lowStockTable = {
      title: "Düsük Stoklu Ürünler",
      headers: ["Ürün", "Kategori", "Stok", "Fiyat", "Toplam"],
      rows: data.lowStock.map((product: any) => [
        product.name,
        product.category.name,
        product.quantity.toString(),
        new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price),
        new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price * product.quantity)
      ])
    };

    // Tabloları çiz
    doc.table(categoryTable, {
      width: 500,
      padding: 10,
      prepareHeader: () => doc.fontSize(10),
      prepareRow: () => doc.fontSize(10)
    });

    doc.addPage();

    doc.table(lowStockTable, {
      width: 500,
      padding: 10,
      prepareHeader: () => doc.fontSize(10),
      prepareRow: () => doc.fontSize(10)
    });

    doc.end();
  });
}; 