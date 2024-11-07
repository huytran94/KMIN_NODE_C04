import mongoose from "mongoose";
import config from "./config.js";

async function connectToDatabase() {
  try {
    const uri = `mongodb+srv://${config.dbConfig.userName}:${config.dbConfig.password}@cluster0.0amgo.mongodb.net/${config.dbConfig.dbName}?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(uri);
    await mongoose.connection.db.admin().command({ ping: 1000 });
    console.log("Mongodb is connected");
  } catch (error) {
    console.log("Can't connect to db", error);
  }
}

export default connectToDatabase;
