import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
dotenv.config();

import connectToDb from "./config/connectToDB.js";
import bookingRouter from "./router/bookingRouter.js";
import morgan from "morgan";
import errorHandler from "./middleware/errorhandler.js";

app.use(cors());

app.use(express.json());
app.use(morgan("dev"));


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("App is running✅😎");
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to appointment booking website" });
});

connectToDb();

app.use("/booking", bookingRouter);

app.use("/{*any}", errorHandler)


export default app;