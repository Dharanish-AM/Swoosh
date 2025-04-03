import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    link: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["waiting", "connected", "completed", "cancelled"],
      default: "waiting",
    },
    files: {
      type: [String],
      default: [],
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);
