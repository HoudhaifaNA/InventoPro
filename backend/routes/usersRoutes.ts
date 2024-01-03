import express from 'express';

import * as authController from '../controllers/authController';
import * as userController from '../controllers/usersController';

const router = express.Router();

router.post('/login', authController.login);

router.use(authController.protect);

router.post('/logout', authController.logout);
router.get('/getMe', authController.getMe);
router.patch('/updateMe', authController.updateMe);

router.route('/').post(userController.createUser);

export default router;
