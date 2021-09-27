import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {} from 'express-async-errors';
import * as authRepository from '../data/data_auth.js';
import { config } from '../config.js';




const createJwtToken = (id) => {
  console.log(config.jwt.secretKey);
  return jwt.sign({id}, config.jwt.secretKey, {expiresIn: config.jwt.expiresInSec})
}

export const signUp = async(req, res) => {
  const {username, password, name, email, url} = req.body;
  const found = await authRepository.findByUsername(username);
  if(found){
    return res.status(409).json({message: `${username} exist`})
  }
  const hased = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await authRepository.createUser({
    username,
    password: hased,
    name,
    email,
    url,
  });
  const token = createJwtToken(userId);
  res.status(201).json({ token, username });
};

export const login = async(req, res, next) => {
  const {username, password} = req.body;
  const user = await authRepository.findByUsername(username);
  if(!user){
    return res.status(401).json({message: `invalid value`})
  };
  const isValidPassword = await bcrypt.compare(password, user.password);
  if(!isValidPassword){
    return res.status(401).json({message: `invalid value`});
  }
  const token = createJwtToken(user.id);
  res.status(200).json({ token, username });
};

export const me = async(req, res, next) => {
  const user = await authRepository.findById(req.userId);
  if(!user){
    return res.status(404).json({ message: 'User not found'});
  }
  res.status(200).json({ token: req.token, username: user.username})
};

