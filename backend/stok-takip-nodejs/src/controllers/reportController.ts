import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { createStockReport } from '../services/pdfService';
import { createStockExcel } from '../services/excelService';

const prisma = new PrismaClient();

export const getStockReport: RequestHandler = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        StockMove: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    const report = products.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category.name,
      currentStock: product.quantity,
      price: product.price,
      value: product.quantity * product.price,
      recentMoves: product.StockMove
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Rapor oluşturulurken bir hata oluştu' });
  }
};

export const getLowStockAlert: RequestHandler = async (req, res) => {
  try {
    const minStock = 10;
    
    const lowStockProducts = await prisma.product.findMany({
      where: {
        quantity: {
          lte: minStock
        }
      },
      include: {
        category: true
      }
    });

    res.json({
      alertCount: lowStockProducts.length,
      products: lowStockProducts.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category.name,
        currentStock: product.quantity,
        minimumStock: minStock
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Düşük stok raporu oluşturulurken bir hata oluştu' });
  }
};

export const getStockMovementReport: RequestHandler = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const movements = await prisma.stockMove.findMany({
      where: {
        createdAt: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined
        }
      },
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const report = {
      totalMovements: movements.length,
      incomingStock: movements.filter(m => m.type === 'IN')
        .reduce((sum, m) => sum + m.quantity, 0),
      outgoingStock: movements.filter(m => m.type === 'OUT')
        .reduce((sum, m) => sum + m.quantity, 0),
      movements: movements.map(m => ({
        date: m.createdAt,
        type: m.type,
        quantity: m.quantity,
        product: {
          name: m.product.name,
          sku: m.product.sku,
          category: m.product.category.name
        }
      }))
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Stok hareket raporu oluşturulurken bir hata oluştu' });
  }
};

export const ReportController = {
  getReports: (async (req, res) => {
    try {
      const data = await ReportController.getReportData();
      res.json(data);
    } catch (error) {
      console.error('Report error:', error);
      res.status(500).json({ error: 'Raporlar oluşturulurken bir hata oluştu' });
    }
  }) as RequestHandler,

  downloadPdf: (async (req, res) => {
    try {
      const data = await ReportController.getReportData();
      const pdfBuffer = await createStockReport(data);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=stok-raporu.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'PDF oluşturulurken bir hata oluştu' });
    }
  }) as RequestHandler,

  downloadExcel: (async (req, res) => {
    try {
      const data = await ReportController.getReportData();
      const buffer = await createStockExcel(data);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=stok-raporu.xlsx');
      res.send(buffer);
    } catch (error) {
      console.error('Excel generation error:', error);
      res.status(500).json({ error: 'Excel dosyası oluşturulurken bir hata oluştu' });
    }
  }) as RequestHandler,

  getReportData: async () => {
    const [categories, lowStock, recentMoves, monthlyStats] = await Promise.all([
      // Kategoriler ve ürünler
      prisma.category.findMany({
        include: {
          products: {
            select: {
              id: true,
              name: true,
              price: true,
              quantity: true
            }
          }
        }
      }),

      // Düşük stoklu ürünler
      prisma.product.findMany({
        where: { quantity: { lt: 10 } },
        select: {
          id: true,
          name: true,
          sku: true,
          quantity: true,
          price: true,
          category: { select: { name: true } }
        },
        orderBy: { quantity: 'asc' },
        take: 10
      }),

      // Son stok hareketleri
      prisma.stockMove.findMany({
        select: {
          id: true,
          type: true,
          quantity: true,
          createdAt: true,
          product: {
            select: {
              name: true,
              price: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Aylık istatistikler
      prisma.stockMove.groupBy({
        by: ['type'],
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { quantity: true }
      })
    ]);

    const stockValue = {
      total: 0,
      byCategory: categories.map(category => {
        const value = category.products.reduce((sum, product) => 
          sum + (product.price || 0) * (product.quantity || 0), 0);
        
        return {
          categoryName: category.name,
          value,
          productCount: category.products.length
        };
      })
    };

    stockValue.total = stockValue.byCategory.reduce((sum, cat) => sum + cat.value, 0);

    const monthlySummary = {
      in: monthlyStats.find(stat => stat.type === 'IN')?._sum.quantity || 0,
      out: monthlyStats.find(stat => stat.type === 'OUT')?._sum.quantity || 0
    };

    return {
      stockValue,
      lowStock,
      recentMoves,
      monthlySummary
    };
  }
};

export const getCategoryStats: RequestHandler = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            price: true,
            quantity: true
          }
        }
      }
    });

    const stats = categories.map(category => ({
      id: category.id,
      name: category.name,
      productCount: category.products.length,
      totalValue: category.products.reduce(
        (sum, product) => sum + (product.price * product.quantity), 
        0
      ),
      averagePrice: category.products.length > 0
        ? category.products.reduce((sum, product) => sum + product.price, 0) / category.products.length
        : 0
    }));

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Kategori istatistikleri alınırken bir hata oluştu' });
  }
}; 