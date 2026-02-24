import bookingModel from "../model/bookingModel.js";
import nodemailer from "nodemailer";
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

export const bookingDetails = async (req, res, next) => {
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
    next(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const sendBookingEmail = async (req, res, next) => {
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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      // host: "smtp.gmail.com",
      // port: 465,
      host: "74.125.142.108",
      port: 465,
      family:4,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        servername: "smtp.gmail.com",
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
    });
    const clientMail = {
      from: `"Limadollz beauty world"<${process.env.EMAIL_USER}>`,
      to: bookingDetails.email,
      subject: "APPOINTMENT CONFIRMED!✨",
      html: `<h1>Hi ${bookingDetails.fullName}, your booking is set!</h1>
    <p>Your session for <b>${bookingDetails.service}</b> is booked for ${bookingDetails.num} ${bookingDetails.day} ${bookingDetails.month}  at ${bookingDetails.time}.</p>`,
    };
    const adminMail = {
      from: `"Booking System"<${process.env.EMAIL_USER}>`,
      to: "adeniyiferanmielizabeth@gmail.com",
      subject: "🚨 NEW APPOINTMENT BOOKED",
      html: `<h2>New Booking Received!</h2>
             <ul>
               <li><b>Client:</b> ${bookingDetails.fullName}</li>
               <li><b>Phone Number:</b> ${bookingDetails.phoneNumber}</li>
               <li><b>Service:</b> ${bookingDetails.service}</li>
               <li><b>Phone:</b> ${bookingDetails.phoneNumber}</li>
               <li><b>Time:</b> ${bookingDetails.num} ${bookingDetails.day} ${bookingDetails.month} at ${bookingDetails.time}</li>
               <li><b>Message:</b> ${bookingDetails.message}</li>
               
             </ul>`,
    };

    await Promise.all([
      transporter.sendMail(clientMail),
      transporter.sendMail(adminMail),
    ]);

    res.status(200).json({
      status: "success",
      message: "Emails sent successfully using database details!",
      bookingDetails,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
