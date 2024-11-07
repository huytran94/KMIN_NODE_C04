import dotenv from "dotenv";
dotenv.config();

const config = {
  dbConfig: {
    userName: process.env.DB_USER,
    password: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
  },
  bCrypt: {
    salt: 10,
  },
  jwt: {
    secretkey: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

};
export default config;
