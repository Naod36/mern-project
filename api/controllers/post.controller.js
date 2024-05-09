import Case from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Only Admin can create a Case Templates"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "All fields are required"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newCase = new Case({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedCase = await newCase.save();
    res.status(200).json(savedCase);
  } catch (error) {
    next(error);
  }
};

export const getcasetemplates = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const cases = await Case.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { category: req.query.slug }),
      ...(req.query.caseId && { _id: req.query.caseId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updateAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalCases = await Case.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthCases = await Case.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      cases,
      totalCases,
      lastMonthCases,
    });
  } catch (error) {
    console.log(error);
  }
};
