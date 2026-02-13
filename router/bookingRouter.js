import { Router } from "express";
import bookingDetails from "../controller/bookingController.js";
const bookingRouter = Router()

bookingRouter.post("/",bookingDetails)
export default bookingRouter