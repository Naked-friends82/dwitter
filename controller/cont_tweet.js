import { getSocketIO } from '../connection/socket.js';
import * as tweetRepository from '../data/data_tweet.js';


export const getTweets = async(req, res, next) => {
  const username = req.query.username;
  const data = await (username 
  ? tweetRepository.getAllByUsername(username)
  : tweetRepository.getAll());
  res.status(200).json(data);
};

export const getTweet = async(req, res, next) => {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if(tweet){    
    res.status(200).json(tweet);
  } else{
    res.status(404).json({message: `no tweet from ${id}`});
  };
}

export const createTweet = async(req, res, next) => {
  const {text} = req.body;
  const tweet = await tweetRepository.create(text, req.userId);
  res.status(201).json(tweet);
  getSocketIO().emit('tweets', tweet);
};

export const updateTweet = async(req, res, next) => {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = await tweetRepository.getById(id);
  if(!tweet){
    return res.status(404).json({ message: `Tweet not found: ${id}` });
  }
  if(tweet.userId !== req.userId){
    return res.sendStatus(403);
  }

  const updated = await tweetRepository.update(id, text);
    res.status(200).json(updated);
};

export const removeTweet = async(req, res, next) => {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if(!tweet){
    return res.sendStatus(404);
  }
  if(tweet.userId !== req.userId){
    return res.sendStatus(403);
  }
  await tweetRepository.remove(id);
  res.sendStatus(204);
};