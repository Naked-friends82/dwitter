import express from 'express';
import {} from 'express-async-errors';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as authController from '../controller/cont_auth.js';
import { isAuth } from '../middleware/mid_auth.js';


const route = express.Router();

const validateCredential = [
  body('username')
  .trim()
  .notEmpty()
  .withMessage('username should be more'),
  body('password')
  .trim()
  .isLength({min: 5})
  .withMessage('need more pw'),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body('name').notEmpty().withMessage('no name'),
  body('email').isEmail().normalizeEmail().withMessage('invalid email'),
  body('url').isURL().withMessage('invalid URL').optional({ nullable: true, checkFalsy: true }),
  validate,
]

route.post('/signup', validateSignup, authController.signUp );

route.post('/login', validateCredential, authController.login );

route.get('/me', isAuth, authController.me );

export default route;
