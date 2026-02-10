const cron = require("node-cron");
const BemeTask = require("./beme.model");

// runs every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const expiredTasks = await BemeTask.find({
      status: "pending",
      endTime: { $lt: now },
    });

    for (const task of expiredTasks) {
      task.status = "failed";
      await task.save();
    }

    if (expiredTasks.length > 0) {
      console.log(`BEME.PRO auto-failed ${expiredTasks.length} task(s)`);
    }
  } catch (err) {
    console.error("BEME.PRO CRON ERROR:", err.message);
  }
});
