import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const CategoryController = {
  getAll: (async (req, res) => {
    try {
      const categories = await prisma.category.findMany({
        include: {
          products: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Kategoriler yüklenirken bir hata oluştu' });
    }
  }) as RequestHandler,

  create: (async (req, res) => {
    try {
      const { name } = req.body;
      const category = await prisma.category.create({
        data: { name }
      });
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: 'Kategori oluşturulurken bir hata oluştu' });
    }
  }) as RequestHandler,

  delete: (async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.category.delete({
        where: { id: Number(id) }
      });
      res.json({ message: 'Kategori başarıyla silindi' });
    } catch (error) {
      res.status(400).json({ error: 'Kategori silinirken bir hata oluştu' });
    }
  }) as RequestHandler
}; 