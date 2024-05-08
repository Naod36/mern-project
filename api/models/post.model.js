import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1145122267/vector/law-order-court-symbols-vector-illustration.jpg?s=612x612&w=0&k=20&c=zUiwEJDkWJcI2p5fLRdbcBxwFONAampY8inYpol0v0g=",
    },
    category: {
      type: String,
      default: "Ucategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
