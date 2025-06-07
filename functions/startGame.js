const db = require("./db");

module.exports = async (req, res) => {
  const { userId } = req.body;
  const ref = await db.collection("game_sessions").add({ userId, startTime: new Date() });
  res.status(200).json({ message: "Game session started", sessionId: ref.id });
};