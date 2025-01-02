import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const StockMoveController = {
  getAll: (async (req, res) => {
    try {
      const moves = await prisma.stockMove.findMany({
        include: {
          product: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.json(moves);
    } catch (error) {
      res.status(500).json({ error: 'Stok hareketleri listelenirken bir hata oluştu' });
    }
  }) as RequestHandler,

  create: (async (req, res) => {
    try {
      const { productId, type, quantity } = req.body;

      // Ürünü kontrol et
      const product = await prisma.product.findUnique({
        where: { id: Number(productId) }
      });

      if (!product) {
        return res.status(400).json({ error: 'Ürün bulunamadı' });
      }

      // Çıkış işleminde stok kontrolü
      if (type === 'OUT' && product.quantity < quantity) {
        return res.status(400).json({ error: 'Yetersiz stok' });
      }

      // Transaction ile stok hareketi ve ürün güncelleme
      const result = await prisma.$transaction([
        // Stok hareketi oluştur
        prisma.stockMove.create({
          data: {
            type,
            quantity: Number(quantity),
            productId: Number(productId)
          },
          include: {
            product: true
          }
        }),
        // Ürün stok miktarını güncelle
        prisma.product.update({
          where: { id: Number(productId) },
          data: {
            quantity: type === 'IN' 
              ? product.quantity + Number(quantity)
              : product.quantity - Number(quantity)
          }
        })
      ]);

      res.status(201).json(result[0]);
    } catch (error) {
      console.error('Stock move error:', error);
      res.status(400).json({ error: 'Stok hareketi oluşturulurken bir hata oluştu' });
    }
  }) as RequestHandler
}; 