import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const UserController = {
  getAll: (async (req: any, res) => {
    try {
      const users = await prisma.user.findMany({
        where: req.user.role === 'ADMIN' ? {} : { id: req.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Kullanıcılar listelenirken bir hata oluştu' });
    }
  }) as RequestHandler,

  create: (async (req, res) => {
    try {
      const { email, password, name, role } = req.body;

      // Email kontrolü
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Bu email adresi zaten kullanımda' });
      }

      // Şifre hash'leme
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Kullanıcı oluşturulurken bir hata oluştu' });
    }
  }) as RequestHandler,

  delete: (async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      // Kullanıcı kendini veya admin başka kullanıcıyı silebilir
      if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
        return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
      }

      await prisma.user.delete({
        where: { id: userId }
      });
      res.json({ message: 'Kullanıcı başarıyla silindi' });
    } catch (error) {
      res.status(400).json({ error: 'Kullanıcı silinirken bir hata oluştu' });
    }
  }) as RequestHandler,

  changePassword: (async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      // Kullanıcı kendi şifresini veya admin başka kullanıcının şifresini değiştirebilir
      if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
        return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
      }

      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      }

      // Admin başkasının şifresini değiştirirken mevcut şifre kontrolü yapılmaz
      if (req.user.role !== 'ADMIN') {
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
          return res.status(400).json({ error: 'Mevcut şifre yanlış' });
        }
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      res.json({ message: 'Şifre başarıyla güncellendi' });
    } catch (error) {
      res.status(400).json({ error: 'Şifre güncellenirken bir hata oluştu' });
    }
  }) as RequestHandler,

  changeOwnPassword: (async (req, res) => {
    try {
      const userId = req.user?.id; // Auth middleware'den gelen kullanıcı ID'si
      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      }

      // Mevcut şifre kontrolü
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ error: 'Mevcut şifre hatalı' });
      }

      // Yeni şifreyi hashle ve güncelle
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      res.json({ message: 'Şifreniz başarıyla güncellendi' });
    } catch (error) {
      res.status(500).json({ error: 'Şifre değiştirme işlemi başarısız oldu' });
    }
  }) as RequestHandler,

  updateProfile: (async (req, res) => {
    try {
      const userId = req.user?.id;
      const { name, email } = req.body;

      // Email değişiyorsa, yeni email'in başka kullanıcı tarafından kullanılmadığını kontrol et
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email }
        });

        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: 'Bu email adresi zaten kullanımda' });
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name, email },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Profil güncellenirken bir hata oluştu' });
    }
  }) as RequestHandler
}; 