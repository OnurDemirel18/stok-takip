import express from 'express';
import { UserController } from '../controllers/userController';
import { auth, adminAuth } from '../middlewares/auth';

const router = express.Router();

router.get('/', auth, adminAuth, UserController.getAll);
router.post('/', auth, adminAuth, UserController.create);
router.delete('/:id', auth, adminAuth, UserController.delete);
router.post('/:id/change-password', auth, UserController.changePassword);
router.post('/change-password', auth, UserController.changeOwnPassword);
router.put('/profile', auth, UserController.updateProfile);

export default router; 