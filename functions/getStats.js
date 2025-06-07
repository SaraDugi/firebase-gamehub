const db = require("./db");

module.exports = async (req, res) => {
  const { userId } = req.query;
  const snapshot = await db.collection("game_sessions").where("userId", "==", userId).get();
  const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.status(200).json({ sessions });
};