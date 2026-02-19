import mongoose from "mongoose";

const bookingShema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
      enum: [
        "Hair Services",
        "Makeup Artistry",
        "Brows & Lashes",
        "Semi-Permanent Tattoos",
      ],
    },

    day: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    num: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
const bookingModel = mongoose.model("booking", bookingShema);
export default bookingModel;
