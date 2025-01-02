import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DashboardController = {
  getStats: (async (req, res) => {
    try {
      // Toplam ürün ve kategori sayısı
      const [totalProducts, totalCategories] = await Promise.all([
        prisma.product.count(),
        prisma.category.count()
      ]);

      // Düşük stoklu ürünler (stok < 10)
      const lowStockProducts = await prisma.product.findMany({
        where: {
          quantity: {
            lt: 10
          }
        },
        select: {
          id: true,
          name: true,
          sku: true,
          quantity: true,
          category: {
            select: {
              name: true
            }
          }
        }
      });

      // Son stok hareketleri (son 10 hareket)
      const recentMoves = await prisma.stockMove.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          product: {
            select: {
              name: true
            }
          }
        }
      });

      // Kategori bazlı stok dağılımı
      const categoryDistribution = await prisma.category.findMany({
        include: {
          products: {
            select: {
              price: true,
              quantity: true
            }
          }
        }
      });

      // Son 6 ayın stok hareketleri
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const stockMoves = await prisma.stockMove.findMany({
        where: {
          createdAt: {
            gte: sixMonthsAgo
          }
        },
        include: {
          product: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      // En çok hareket gören 10 ürün
      const topProducts = await prisma.product.findMany({
        include: {
          StockMove: true,
          category: true
        },
        orderBy: {
          StockMove: {
            _count: 'desc'
          }
        },
        take: 10
      });

      // Verileri formatla
      const stats = {
        totalProducts,
        totalCategories,
        lowStockProducts: lowStockProducts.map(p => ({
          ...p,
          category: p.category.name
        })),
        recentMoves,
        categoryDistribution: categoryDistribution.map(cat => ({
          name: cat.name,
          value: cat.products.reduce((sum, prod) => sum + (prod.price * prod.quantity), 0),
          productCount: cat.products.length
        })),
        monthlyMoves: Object.entries(
          stockMoves.reduce((acc: any, move) => {
            const month = move.createdAt.toISOString().slice(0, 7);
            if (!acc[month]) {
              acc[month] = { in: 0, out: 0 };
            }
            if (move.type === 'IN') {
              acc[month].in += move.quantity;
            } else {
              acc[month].out += move.quantity;
            }
            return acc;
          }, {})
        ).map(([month, data]: [string, any]) => ({
          month,
          ...data
        })),
        topProducts: topProducts.map(product => ({
          name: product.name,
          category: product.category.name,
          moveCount: product.StockMove.length,
          totalQuantity: product.StockMove.reduce((sum, move) => 
            sum + (move.type === 'IN' ? move.quantity : -move.quantity), 0
          )
        }))
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'İstatistikler alınırken bir hata oluştu' });
    }
  }) as RequestHandler
}; 