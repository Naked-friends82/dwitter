import * as authRepository from './data_auth.js';
// import {db} from '../db/database.js';
import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import {User} from '../data/data_auth.js'
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

const Tweet = sequelize.define('tweet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
Tweet.belongsTo(User);

const INCLUDE_USER = {
  attributes: [
    'id',
    'text', 
    'createdAt', 
    'userId', 
    [Sequelize.col('user.name'), 'name'],
    [Sequelize.col('user.username'), 'username'],
    [Sequelize.col('user.url'), 'url'],
  ],
  include: {
    model: User,
    attributes: []
  },
};
const ORDER_DESC = {
  order: [['createdAt', 'DESC']],
};

// const SELECT_JOIN = 'SELECT tw.id, tw.text, tw.createdAt, tw.userId, us.username, us.name, us.url FROM tweets as tw JOIN users as us ON tw.userId=us.id';
// const ORDER_DESC = 'ORDER BY tw.createdAt DESC';

export async function getAll(){
  return Tweet.findAll({...INCLUDE_USER, ...ORDER_DESC});

  // return db.execute(`${SELECT_JOIN} ${ORDER_DESC}`)
  //   .then(result => result[0]);

  // return Promise.all(
  //   tweets.map(async(tweet) => {
  //     const {username, name, url} = await authRepository.findById(tweet.userId);
  //     return {...tweet, username, name, url};
  //   })
  // );
};

export async function getAllByUsername(username){
  return Tweet.findAll({
    ...INCLUDE_USER, 
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: {username},
    },
  });

  // return db.execute(`${SELECT_JOIN} WHERE username=? ${ORDER_DESC}`, [username])
  //   .then(result => result[0]);

  // return getAll().then((tweets) => 
  //   tweets.filter(t => t.username === username)
  // );
};

export async function getById(id){
  return Tweet.findOne({
    where: {id},
    ...INCLUDE_USER,
  })

  // return db.execute(`${SELECT_JOIN} WHERE tw.id=?`, [id])
  // .then(result => result[0][0]);

  // const found = tweets.find((tweet) => tweet.id === id);
  // if(!found){
  //   return null;
  // }
  // const { username, name, url } = await authRepository.findById(found.userId);
  // return {...found, username, name, url};
};

export async function create(text, userId){
  return Tweet.create({ text, userId })
  .then(data => this.getById(data.dataValues.id));

  // return db.execute(
  //   'INSERT INTO tweets (text, createdAt, userId) VALUES (?,?,?)',
  //   [text, new Date(), userId]
  // ).then(result => getById(result[0].insertId));

  // const tweet = {
  //   id: new Date().toString(),
  //   text,
  //   createdAt: new Date(),
  //   userId,
  // };
  // tweets = [tweet, ...tweets];
  // return getById(tweet.id);
};

export async function update(id, text){
  return Tweet.findByPk(id, INCLUDE_USER)
  .then(tweet => {
    tweet.text = text;
    return tweet.save();
  });

  // return db.execute(
  //   'UPDATE tweets SET text=? WHERE id=?',
  //   [text, id]
  // ).then(() => getById(id));

  // const tweet = tweets.find(t => t.id === id);
  // if(tweet){
  //   tweet.text = text;
  // } 
  // return getById(tweet.id);
};

export async function remove(id){
  return Tweet.findByPk(id, INCLUDE_USER)
  .then(tweet => {
    tweet.destroy();
  });

  // return db.execute(
  //   'DELETE FROM tweets WHERE id=?', [id]
  // );

  // tweets = tweets.filter(t => t.id !== id);
};