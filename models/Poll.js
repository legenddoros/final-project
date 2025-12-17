const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  q1: { type: Boolean },
  q2p1: { type: Boolean },
  q2p2: { type: Number, min: 0 },
  q3: { type: String, trim: true },
  q4: { type: String, trim: true },
  q5: { type: Boolean },
});

module.exports = mongoose.model("Poll", pollSchema);
