// import {db} from '../db/database.js'
import {sequelize} from '../db/database.js'
import SQ from 'sequelize';
const DataTypes = SQ.DataTypes;

export const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  url: DataTypes.TEXT,
}, {timestamps: false});

export const findByUsername = async(username) => {
  return User.findOne({where: {username}});

  // return db
  // .execute('SELECT * FROM users WHERE username=?', [username])
  // .then(result => result[0][0]);

  // return users.find((u) => u.username === username);
};

export const findById = async(id) => {
  return User.findByPk(id);

  // return db
  // .execute('SELECT * FROM users WHERE id=?', [id])
  // .then(result => result[0][0]);

  // return users.find((u) => u.id === id);
};

export const createUser = async(user) => {
  return User.create(user).then(data => data.dataValues.id);

  // const {username, password, name, email, url} = user;
  // return db.execute(
  //   'INSERT INTO users (username, password, name, email, url) VALUES (?,?,?,?,?)', 
  //   [username, password, name, email, url]
  // ).then((result) => result[0].insertId);

  // const created = {...user, id: Date.now().toString() };
  // users.push(created);
  // return created.id;
};