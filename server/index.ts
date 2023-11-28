import dotenv from 'dotenv'
dotenv.config();

// require important modules
import express from "express"
const app = express(); // server module
const session = require("express-session");
const server = require("http").createServer(app);
const cors = require("cors");
const compression = require("compression");
import router from './routes'
import { corsConfig, sessionConfig } from './config/sessionConfig';
const PORT = process.env.PORT || 3000;
app.set("trust proxy", 1);
app.use(cors(corsConfig));
app.use(session(sessionConfig));

app.use(express.json());
app.use(compression());
app.use(router);
server.listen(PORT, (err: any) => {
  if (err) {
    throw err;
  }
  console.clear();
  console.log(`Live on ${PORT}`);
});
