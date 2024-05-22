import mongoose from "mongoose";
import cron from "node-cron";

const { Schema } = mongoose;
// Define schema for the answer
const AnswerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Use ObjectId type for referencing the User model
      ref: "User", // Reference the User model
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    spouseFirstName: {
      type: String,
      required: true,
    },
    spouseMiddleName: {
      type: String,
      required: true,
    },
    spouseLastName: {
      type: String,
      required: true,
    },
    image1: {
      type: String, // You can adjust the type as per your requirements (e.g., Buffer for file upload)
      required: true,
    },
    image2: {
      type: String, // You can adjust the type as per your requirements (e.g., Buffer for file upload)
      required: true,
    },
    category: {
      type: String,
      default: "Divorce Case",
    },
    details: {
      type: String,
      // required: true,
    },
    judgeStatement: {
      type: String,
      // required: true,
    },
    judgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming User is your user model
      default: null,
    },
    date: {
      type: Date,
    },
    state: {
      type: String,
      enum: ["pending", "approved", "denied", "closed"],
      default: "pending",
    },
    reason: {
      type: String,
      default: "Not Provided",
    },
    result: {
      type: String,
      default: "Not Provided",
    },
    judgeStatement: {
      type: String,
      default: "Not Provided",
    },
  },

  { timestamps: true }
);

// Middleware to nullify past dates
AnswerSchema.pre("save", function (next) {
  const now = new Date();
  if (this.date && this.date < now) {
    this.date = null;
  }
  next();
});

// Create and export the model
const Answer = mongoose.model("Answer", AnswerSchema);

export default Answer;
