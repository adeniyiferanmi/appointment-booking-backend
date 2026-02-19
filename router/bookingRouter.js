import { Router } from "express";
import { bookingDetails, sendBookingEmail } from "../controller/bookingController.js";
// import bookingDetails from "../controller/bookingController.js";
const bookingRouter = Router()

bookingRouter.post("/",bookingDetails)
bookingRouter.post("/send-email/:bookingsId",sendBookingEmail)
export default bookingRouter