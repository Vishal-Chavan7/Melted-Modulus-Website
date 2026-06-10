import express from 'express'
import {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    changeRefreshToken,
} from '../controllers/user.controller.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from '../validations/user.validation.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register').post(validateMiddleware(registerSchema), registerUser);
router.route('/login').post(validateMiddleware(loginSchema), loginUser);
router.route('/logout').post(authMiddleware, logoutUser);
router.route('/forgot-password').post(validateMiddleware(forgotPasswordSchema), forgotPassword);
router.route('/reset-password').post(validateMiddleware(resetPasswordSchema), resetPassword);
router.route('/refresh-token').post(changeRefreshToken);

export default router;