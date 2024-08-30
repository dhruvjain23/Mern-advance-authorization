import express from 'express'
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, verifyEmail } from '../controllers/auth.controllers.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/check-auth',verifyToken, checkAuth)

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)
router.post('/verify-email',verifyEmail)
router.post('/forgot-pass',forgotPassword)
router.post('/reset-pass/:token',resetPassword)




export default router;