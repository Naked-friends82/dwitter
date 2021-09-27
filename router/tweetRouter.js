import express from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as tweetController from '../controller/cont_tweet.js';
import { isAuth } from '../middleware/mid_auth.js';


const router = express.Router();

const validateTweet = [ 
  body('text').trim().isLength({min: 3}).withMessage('text should be long'), validate
];

router.get('/',isAuth ,tweetController.getTweets);

router.get('/:id',isAuth, tweetController.getTweet);

router.post('/',isAuth, validateTweet, tweetController.createTweet);

router.put('/:id',isAuth, validateTweet, tweetController.updateTweet);

router.delete('/:id',isAuth, tweetController.removeTweet);

export default router;