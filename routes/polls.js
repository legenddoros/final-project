const express = require("express");
const Poll = require("../models/Poll.js");

const router = express.Router();

// GET all poll responses
router.get("/", async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

router.post("/", async (req, res) => {
  try {
    const allowedFields = ["q1", "q2p1", "q2p2", "q3", "q4", "q5"];
    const data = {};

    allowedFields.forEach((field) => {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== null &&
        req.body[field] !== ""
      ) {
        data[field] = req.body[field];
      }
    });

    // If no valid fields, ignore
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No valid data submitted." });
    }

    // Validation
    if (data.q1 !== undefined && typeof data.q1 !== "boolean")
      return res.status(400).json({ error: "Q1 must be Yes/No." });

    if (data.q2p1 !== undefined && typeof data.q2p1 !== "boolean")
      return res.status(400).json({ error: "Q2p1 must be Yes/No." });

    if (
      data.q2p2 !== undefined &&
      (!Number.isInteger(data.q2p2) || data.q2p2 < 0)
    )
      return res
        .status(400)
        .json({ error: "Q2p2 must be a positive integer." });

    if (data.q5 !== undefined && typeof data.q5 !== "boolean")
      return res.status(400).json({ error: "Q5 must be Yes/No." });

    const poll = new Poll(data);
    await poll.save();
    res.status(201).json({ message: "Answer saved." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
