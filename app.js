import express from 'express';
import cors from 'cors';       //브라우저 승인
import morgan from 'morgan';   //디버깅
import helmet from 'helmet';   //보완
import 'express-async-errors'  //에러잡기
import authRouter from './router/authRouter.js';
import tweetRouter from './router/tweetRouter.js';
import { config } from './config.js';
import {initSocket} from './connection/socket.js';
// import { db } from './db/database.js';
import { sequelize } from './db/database.js';
import { login } from './controller/cont_auth.js';


const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOption));
app.use(morgan('tiny'));
app.use(helmet());

// app.use('/auth', authRouter);
app.use('/tweets', tweetRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({message: "Something wrong"})
});


// db.getConnection().then((connection) => console.log(connection));
sequelize.sync().then(() => {
  console.log(`Server is started...${new Date()}`);
  const server = app.listen(config.port);
  initSocket(server);
});



// const server = app.listen(config.host.port);
// initSocket(server);




//config들어가기 전 이런 오타 때문에 안됐어!!!
//cont_auth
//res.staus
//cont_tweet, delete, update에서
// if(tweet.userId (여기!!!)=== req.userId){
//   return res.sendStatus(403);
// }
// if(tweet.userId === req.userId){
//   return res.sendStatus(403);
// }

//data_tweet getall이 async가 아니었다
