import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/user';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const auth: RequestHandler = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'Lütfen giriş yapın.' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Lütfen giriş yapın.' });
  }
};

export const adminAuth: RequestHandler = (req, res, next) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Bu işlem için yetkiniz yok.' });
      return;
    }
    next();
  } catch (err) {
    res.status(403).json({ error: 'Bu işlem için yetkiniz yok.' });
  }
};