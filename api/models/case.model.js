import mongoose from "mongoose";

const { Schema } = mongoose;
// Define schema for the answer
const AnswerSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Use ObjectId type for referencing the User model
      ref: "User", // Reference the User model
      required: true,
    },
    names: [
      {
        firstName: {
          type: String,
          required: true,
        },
        middleName: {
          type: String,
          default: "",
        },
        lastName: {
          type: String,
          required: true,
        },
        image: {
          type: String, // You can adjust the type as per your requirements (e.g., Buffer for file upload)
          required: true,
        },
      },
    ],

    category: {
      type: String,
      default: "Divorce Case",
    },

    date: {
      type: Date,
      required: true,
    },
    state: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Create and export the model
const Answer = mongoose.model("Answer", AnswerSchema);

export default Answer;
