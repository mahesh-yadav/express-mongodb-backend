import express from 'express';
import AuthController from '../controllers/auth';
import { body } from 'express-validator';

const authRouter = express.Router();

authRouter.post(
  '/signin',
  [
    body('email')
      .not()
      .isEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is invalid')
      .normalizeEmail(),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Password is required')
      .isLength({ min: 3 })
      .withMessage('Password should be atleast 3 characters long'),
  ],
  AuthController.signin
);

export default authRouter;
