import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

// SKU oluşturma fonksiyonu
const generateSKU = async (categoryId: number, prisma: PrismaClient) => {
  // Kategori bilgisini al
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  
  // Kategorinin ilk 3 harfini al (veya daha az ise tümünü)
  const categoryPrefix = (category?.name || 'XXX').slice(0, 3).toUpperCase();
  
  // O kategorideki ürün sayısını bul
  const productCount = await prisma.product.count({
    where: { categoryId }
  });

  // Tarih bilgisi (YYMMDD formatında)
  const dateStr = format(new Date(), 'yyMMdd');
  
  // SKU formatı: KAT-YYMMDD-001
  const sequence = String(productCount + 1).padStart(3, '0');
  return `${categoryPrefix}-${dateStr}-${sequence}`;
};

export const ProductController = {
  getAll: (async (req, res) => {
    try {
      const products = await prisma.product.findMany({
        include: {
          category: true
        }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Ürünler listelenirken bir hata oluştu' });
    }
  }) as RequestHandler,

  create: (async (req, res) => {
    try {
      const { name, description, price, quantity, categoryId } = req.body;

      // Validation
      if (!name || !categoryId) {
        return res.status(400).json({ 
          error: 'Ad ve kategori zorunludur' 
        });
      }

      // SKU otomatik oluştur
      const sku = await generateSKU(Number(categoryId), prisma);

      // Ürünü oluştur
      const product = await prisma.product.create({
        data: {
          name,
          description: description || '',
          sku,
          price: Number(price) || 0,
          quantity: Number(quantity) || 0,
          categoryId: Number(categoryId)
        },
        include: {
          category: true
        }
      });

      // Stok hareketi oluştur
      if (Number(quantity) > 0) {
        await prisma.stockMove.create({
          data: {
            type: 'IN',
            quantity: Number(quantity),
            productId: product.id
          }
        });
      }

      res.status(201).json(product);
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(400).json({ 
        error: 'Ürün oluşturulurken bir hata oluştu' 
      });
    }
  }) as RequestHandler,

  update: (async (req, res) => {
    try {
      const { id } = req.params;
      const productId = Number(id);
      const updates = req.body;

      // Önce mevcut ürünü al
      const currentProduct = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!currentProduct) {
        return res.status(404).json({ error: 'Ürün bulunamadı' });
      }

      // Stok değişikliği varsa, stok hareketi oluştur
      if (updates.quantity !== undefined && updates.quantity !== currentProduct.quantity) {
        const difference = Number(updates.quantity) - currentProduct.quantity;
        await prisma.stockMove.create({
          data: {
            type: difference > 0 ? 'IN' : 'OUT',
            quantity: Math.abs(difference),
            productId
          }
        });
      }

      // Ürünü güncelle
      const product = await prisma.product.update({
        where: { id: productId },
        data: updates,
        include: {
          category: true
        }
      });

      res.json(product);
    } catch (error) {
      console.error('Product update error:', error);
      res.status(400).json({ error: 'Ürün güncellenirken bir hata oluştu' });
    }
  }) as RequestHandler,

  delete: (async (req, res) => {
    try {
      const { id } = req.params;
      const productId = Number(id);

      // Transaction ile önce stok hareketlerini sil, sonra ürünü sil
      await prisma.$transaction([
        // Önce stok hareketlerini sil
        prisma.stockMove.deleteMany({
          where: { productId }
        }),
        // Sonra ürünü sil
        prisma.product.delete({
          where: { id: productId }
        })
      ]);

      res.json({ message: 'Ürün başarıyla silindi' });
    } catch (error) {
      console.error('Product deletion error:', error);
      res.status(400).json({ error: 'Ürün silinirken bir hata oluştu' });
    }
  }) as RequestHandler,

  search: (async (req, res) => {
    try {
      const { query } = req.query;
      
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query as string, mode: 'insensitive' } },
            { sku: { contains: query as string, mode: 'insensitive' } }
          ]
        },
        include: {
          category: true
        }
      });

      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Ürünler aranırken bir hata oluştu' });
    }
  }) as RequestHandler
}; 