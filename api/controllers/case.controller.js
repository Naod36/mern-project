import Answer from "../models/case.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const submitAnswer = async (req, res, next) => {
  try {
    // Extract data from request body
    const { names, file } = req.body;

    // Create new answer document
    const newAnswer = new Answer({
      ...req.body,
      names,
      file,
      date: new Date(),
      state: "pending",
      userId: req.user.id,
    });

    // Save the answer to the database
    const savedAnswer = await newAnswer.save();

    // Send a success response with the saved answer
    res.status(201).json({
      success: true,
      message: "Answer submitted successfully",
      data: savedAnswer,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error saving answer:", error);
    // Pass the error to the error handler middleware
    errorHandler(error, next);
  }
};

export const getAllAnswers = async (req, res, next) => {
  try {
    // Check if user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    // Fetch all answers from the database
    const answers = await Answer.find({
      ...(req.query.caseId && { _id: req.query.caseId }),
    })
      .populate({
        path: "userId",
        select: "username email profilePicture", // Populate only the username field
      })
      .sort({ updateAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalAnswers = await Answer.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthAnswers = await Answer.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res
      .status(200)
      .json({ success: true, answers, totalAnswers, lastMonthAnswers });
  } catch (error) {
    console.log(error);
  }
};

export const getAnswers = async (req, res, next) => {
  try {
    // Check if user is an admin
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    // Fetch all answers from the database
    const answers = await Answer.find({
      ...(req.query.caseId && { _id: req.query.caseId }),
    })
      .populate({
        path: "userId",
        select: "username email profilePicture", // Populate only the username field
      })
      .sort({ updateAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalAnswers = await Answer.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthAnswers = await Answer.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res
      .status(200)
      .json({ success: true, answers, totalAnswers, lastMonthAnswers });
  } catch (error) {
    console.log(error);
  }
};

// Controller for handling admin approval/denial
// export const processnswer = async (req, res, next) => {
//   try {
//     // Check if user is an admin
//     if (!req.user.isAdmin) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to perform this action",
//       });
//     }

//     // Extract data from request body
//     const { answerId, action, date } = req.body;

//     // Find the answer by ID
//     const foundAnswer = await Answer.findById(answerId);
//     if (!foundAnswer) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Answer not found" });
//     }

//     // Update state and date if action is "approved"
//     if (state === "approved") {
//       foundAnswer.state = "approved";
//       foundAnswer.date = date; // Set the approved date provided by the admin
//     } else if (state === "approved") {
//       foundAnswer.state = "approved";
//       foundAnswer.date = date;
//     } else {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid action" });
//     }

//     // Save the updated answer to the database
//     await foundAnswer.save();

//     res.status(200).json({
//       success: true,
//       message: "Answer processed successfully",
//       data: reason,
//     });
//   } catch (error) {
//     errorHandler(error, next);
//   }
// };

export const myCases = async (req, res, next) => {
  try {
    // Retrieve the current user's ID from the request
    const userId = req.user.id;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    // Fetch cases created by the current user from the database
    const mycases = await Answer.find({
      userId,
      ...(req.query.caseId && { _id: req.query.caseId }),
    })
      .sort({ updateAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalCases = await Answer.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthAnswers = await Answer.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res
      .status(200)
      .json({ success: true, mycases, totalCases, lastMonthAnswers });
    console.log("cases", mycases);
  } catch (error) {
    // Handle errors
    console.log(error);
  }
};
export const processAnswer = async (req, res, next) => {
  try {
    // Check if user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    // Extract data from request body
    const { answerId, state, date, reason } = req.body;

    // Find the answer by ID
    const foundAnswer = await Answer.findById(answerId);
    if (!foundAnswer) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found" });
    }

    // Update state and date or reason based on action
    if (state === "approved") {
      foundAnswer.state = "approved";
      foundAnswer.date = date; // Set the approved date provided by the admin
    } else if (state === "denied") {
      foundAnswer.state = "denied";
      foundAnswer.reason = reason; // Set the denial reason provided by the admin
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    // Save the updated answer to the database
    await foundAnswer.save();

    res.status(200).json({
      success: true,
      message: "Answer processed successfully",
    });
  } catch (error) {
    errorHandler(error, next);
  }
};

export const updatemycase = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to update this case template")
    );
  }
  try {
    const updateFields = req.body; // Get the fields to update from the request body

    const updatedPost = await Answer.findByIdAndUpdate(
      req.params.caseId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedPost) {
      return next({
        status: 404,
        message: "Case not found",
      });
    }

    res.status(200).json({
      message: "Case has been updated",
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};
