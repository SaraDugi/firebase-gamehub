const db = require("./db");

module.exports = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid userId in query" });
    }

    const snapshot = await db.collection("game_sessions")
      .where("userId", "==", userId)
      .orderBy("startTime", "desc")
      .get();

    const sessions = snapshot.docs.map(doc => {
      const data = doc.data();
      const start = data.startTime?.toDate?.() || null;
      const end = data.endTime?.toDate?.() || null;
      const duration = start && end ? (end - start) / 1000 : null;

      return {
        id: doc.id,
        startTime: start,
        endTime: end,
        durationSeconds: duration,
      };
    });

    return res.status(200).json({
      userId,
      totalSessions: sessions.length,
      sessions,
    });

  } catch (err) {
    console.error("Error in getStats:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};