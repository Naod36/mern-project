import Answer from "../models/case.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import io from "../index.js";

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

    //Emit socket event to notify user who submitted the case
    io.to(savedAnswer.userId).emit("stateUpdated", savedAnswer);

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
      .sort({ updatedAt: sortDirection })
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
export const getJudge = async (req, res, next) => {
  console.log(req.query.caseId);
  try {
    // Check if user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }

    // Fetch the answer from the database and populate the 'judgeId' field
    const answer = await Answer.findById(req.query.caseId).populate(
      "judgeId",
      "username"
    );
    console.log(answer);

    // If the answer is found and it has a judge, send back the judge's username and ID
    if (answer && answer.judgeId) {
      res.status(200).json({ success: true, judgeId: answer.judgeId });
    } else {
      res.status(404).json({
        success: false,
        message: "Answer not found or no judge assigned",
      });
    }
  } catch (error) {
    console.error("Error fetching assigned judge:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
      .sort({ updatedAt: sortDirection })
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
    const { answerId, state, date, reason, result } = req.body;

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
    } else if (state === "closed") {
      foundAnswer.state = "closed";
      foundAnswer.result = result;
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

    updateFields.state = "pending";

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
export const deletemycase = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this case"));
  }
  try {
    await Answer.findByIdAndDelete(req.params.caseId);
    res.status(200).json("Case has been deleted");
  } catch (error) {
    return next(error);
  }
};
export const getJudges = async (req, res) => {
  try {
    const judges = await User.find({ isJudge: true });
    res.status(200).json(judges);
  } catch (error) {
    console.error("Error fetching judges:", error);
    res.status(500).send("Failed to fetch judges");
  }
};
export const assignCaseToJudge = async (req, res, next) => {
  const { judgeId, caseId, date } = req.body;

  try {
    // // Update the case with the judgeId and assignment date
    // await Answer.findByIdAndUpdate(caseId, {
    //   judgeId: judgeId,
    //   date: date,
    // });

    // Update the case with the judgeId, assignment date, and change the state if needed
    const updatedCase = await Answer.findByIdAndUpdate(
      caseId,
      {
        judgeId: judgeId,
        date: date,
        state: "assigned", // Update state if needed
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Update the judge's assignments
    // await User.findByIdAndUpdate(judgeId, {
    //   $push: {
    //     assignments: {
    //       caseId,
    //       date,
    const updatedUser = await User.findByIdAndUpdate(
      judgeId,
      {
        $push: {
          assignments: {
            caseId,
            date,
          },
        },
      },
      // });
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Judge not found" });
    }

    // Emit socket event to notify assigned judge
    io.to(judgeId).emit("stateUpdated", updatedCase);

    // res.status(200).send("Case assigned successfully");
    res.status(200).json({ message: "Case assigned successfully" });
  } catch (error) {
    console.error("Error assigning case:", error);
    res
      .status(500)
      .json({ message: "Error assigning case", error: error.message });
  }
};

export const getCasesAssignedToJudge = async (req, res) => {
  const { judgeId } = req.params;
  // console.log("Judge ID:", judgeId);
  // console.log("params:", req.params);

  if (!judgeId) {
    return res.status(400).json({ error: "Judge ID is required" });
  }

  try {
    // Fetch the user and populate their assignments
    const judge = await User.findById(judgeId).populate("assignments.caseId");

    if (!judge) {
      return res.status(404).json({ error: "Judge not found" });
    }

    // Filter assignments to get only those with the specific judgeId
    const caseIds = judge.assignments
      // .filter((assignment) => assignment.caseId.judgeId.toString() === judgeId)
      .map((assignment) => assignment.caseId);

    // Fetch the cases from the Answer model using the caseIds
    const cases = await Answer.find({ _id: { $in: caseIds } });
    // const data = cases.map((caseData) => {
    //   return {
    //     id: caseData._id,
    //     state: caseData.state,
    //     date: caseData.date,
    //   };
    // });
    // if (data.state === "denied") {
    //   return res.status(404).json({ error: "Case not found" });
    // }
    // console.log(data);
    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).send("Failed to fetch cases");
  }
};
