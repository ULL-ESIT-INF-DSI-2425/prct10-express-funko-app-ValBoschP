import { connect } from "mongoose";

try {
  await connect(process.env.MONGODB_URL! || "mongodb://127.0.0.1:27017/sports-app");
  console.log("Connection to MongoDB server established");
} catch (error) {
  console.log(error);
}