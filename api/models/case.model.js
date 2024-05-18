import mongoose from "mongoose";

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
      // required: true,
    },
    image2: {
      type: String, // You can adjust the type as per your requirements (e.g., Buffer for file upload)
      // required: true,
    },
    category: {
      type: String,
      default: "Divorce Case",
    },
    details: {
      type: String,
      // required: true,
    },

    date: {
      type: Date,
    },
    state: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    reason: {
      type: String,
      default: "Not Provided",
    },
  },
  { timestamps: true }
);

// Create and export the model
const Answer = mongoose.model("Answer", AnswerSchema);

export default Answer;
