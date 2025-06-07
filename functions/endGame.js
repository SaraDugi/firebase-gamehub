const db = require("./db");

module.exports = async (req, res) => {
  const { sessionId } = req.body;
  const ref = db.collection("game_sessions").doc(sessionId);
  await ref.update({ endTime: new Date() });
  res.status(200).json({ message: "Game session ended" });
};