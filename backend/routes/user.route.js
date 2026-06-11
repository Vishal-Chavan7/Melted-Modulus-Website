import express from 'express'
import {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    changeRefreshToken,
    getCurrentUser,
    updateUserProfile,
} from '../controllers/user.controller.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updateUserProfileSchema,
} from '../validations/user.validation.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorizeRole from '../middlewares/authorizeRole.middleware.js';

const router = express.Router();

router.route('/register').post(validateMiddleware(registerSchema), registerUser);
router.route('/login').post(validateMiddleware(loginSchema), loginUser);
router.route('/logout').post(authMiddleware, logoutUser);
router.route('/forgot-password').post(validateMiddleware(forgotPasswordSchema), forgotPassword);
router.route('/reset-password').post(validateMiddleware(resetPasswordSchema), resetPassword);
router.route('/refresh-token').post(changeRefreshToken);
router.route('/me')
    .get(authMiddleware, authorizeRole('user'), getCurrentUser)
    .patch(authMiddleware, authorizeRole('user'), validateMiddleware(updateUserProfileSchema), updateUserProfile);

export default router;