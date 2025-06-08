const db = require("./db");

module.exports = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const ref = db.collection("game_sessions").doc(sessionId);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Session not found" });
    }

    const data = doc.data();

    if (data.endTime) {
      return res.status(409).json({ error: "Session already ended" });
    }

    const endTime = new Date();
    await ref.update({ endTime });

    const duration =
      data.startTime && data.startTime.toDate
        ? (endTime - data.startTime.toDate()) / 1000
        : null;

    return res.status(200).json({
      message: "Game session ended",
      sessionId,
      endedAt: endTime.toISOString(),
      durationSeconds: duration,
    });
  } catch (err) {
    console.error("Failed to end game session:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};