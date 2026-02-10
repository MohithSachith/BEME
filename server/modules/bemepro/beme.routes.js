const router = require("express").Router();
const ctrl = require("./beme.controller");

// ❌ AUTH REMOVED FOR NOW (DEV MODE)

router.post("/", ctrl.createTask);
router.get("/active", ctrl.getActiveTask);
router.post("/:id/complete", ctrl.completeTask);
router.post("/journal", ctrl.saveJournal);

module.exports = router;
