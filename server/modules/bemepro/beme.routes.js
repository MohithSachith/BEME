// backend/modules/bemepro/beme.routes.js
// BEME.PRO v4 — Route definitions

"use strict";

const express = require("express");
const router  = express.Router();
const ctrl    = require("./beme.controller");

/* ==========================
   COMMITMENT CRUD
========================== */

router.get(    "/commitments",     ctrl.getCommitments);
router.post(   "/commitments",     ctrl.createCommitment);
router.delete( "/commitments/:id", ctrl.deleteCommitment);

/* ==========================
   ATTENDANCE
========================== */

router.post("/mark-present", ctrl.markPresent);
router.post("/mark-absent",  ctrl.markAbsent);

/* ==========================
   JOURNALS
========================== */

router.get("/journals/:id", ctrl.getJournals);

module.exports = router;