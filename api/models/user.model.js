import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isJudge: {
      type: Boolean,
      default: false,
    },
    assignments: [
      {
        caseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Answer", // Assuming Case is your case model
        },
        date: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

User.createIndexes();
export default User;
