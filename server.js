import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
dotenv.config();

import connectToDb from "./config/connectToDB.js";
import bookingRouter from "./router/bookingRouter.js";
import morgan from "morgan";
import errorHandler from "./middleware/errorhandler.js";

// app.use(cors());
const allowedOrigins = [
  "http://localhost:5173", // Your local frontend
  "https://your-frontend-link.vercel.app" // Your future deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

// IMPORTANT: Add this right after the cors middleware
app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("App is running✅😎");
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Limadollz beauty salon" });
});

connectToDb();

app.use("/booking", bookingRouter);

app.use("/{*any}", errorHandler)


export default app;