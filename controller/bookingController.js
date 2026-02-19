import bookingModel from "../model/bookingModel.js";
import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_API_TOKEN;
const ACCOUNT_ID = process.env.MAILTRAP_INBOX_ID
const client = new MailtrapClient({ token: TOKEN,accountId:Number(ACCOUNT_ID )});

export const bookingDetails = async (req, res) => {
  try {
    console.log(req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "no data provided",
      });
    }

    const booking = await bookingModel.create(req.body);

    if (!booking) {
      return res.status(401).json({
        status: "error",
        message: "appointment booking unsuccessful",
      });
    }
    res.status(200).json({
      status: "successful",
      message: "appointment booked successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const sendBookingEmail = async (req, res) => {
  const { email } = req.body;

  const { bookingsId } = req.params;
  if (!bookingsId) {
    return res.status(400).json({
      status: "error",
      message: "bookingId is required",
    });
  }

  try {
    const bookingDetails = await bookingModel.findById(bookingsId);
    if (!bookingDetails || bookingDetails.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "no bookings found",
      });
    }
    const sender = {
      email: "adeniyiferanmi2024@gmail.com",
      name: "Limadollz Beauty world",
    };

    await client.send({
      from: sender,
      to: [{ email: email }],
      subject: "Your Appointment is Confirmed",
      html: `
      <h1>Hi ${bookingDetails.name}, your booking is set!</h1>
      <ul>
        <li><b>Client:</b> ${bookingDetails.name}</li>
        <li><b>Service:</b> ${bookingDetails.service}</li>
        <li><b>Time:</b> ${bookingDetails.date} at ${bookingDetails.time}</li>
        <li><b>Phone:</b> ${bookingDetails.phone}</li>
      </ul>
    `,
    });
    await client.send({
      from: sender,
      to: [{ email: "adeniyiferanmielizabeth@gmail.com" }],
      subject: "🚨 NEW APPOINTMENT BOOKED",
      html: `
      <h2>New Booking Details:</h2>
      <ul>
        <li><b>Client:</b> ${bookingDetails.name}</li>
        <li><b>Service:</b> ${bookingDetails.service}</li>
        <li><b>Time:</b> ${bookingDetails.date} at ${bookingDetails.time}</li>
        <li><b>Phone:</b> ${bookingDetails.phone}</li>
      </ul>
      <p>Check your dashboard for more details.</p>
    `,
    });
    res.status(200).json({
      status: "success",
      message: "Emails sent successfully using database details!",
      bookingDetails,
    });
  } catch (error) {
    console.log(error);
  }
};
