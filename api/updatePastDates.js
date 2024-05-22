import cron from "node-cron";
import Answer from "./models/case.model.js";

// Schedule a task to run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    await Answer.updateMany({ date: { $lt: now } }, { $set: { date: null } });
    console.log("Updated past dates to null");
  } catch (error) {
    console.error("Error updating past dates:", error);
  }
});
