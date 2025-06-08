const db = require("./db");

module.exports = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid userId" });
    }

    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const openSession = await db.collection("game_sessions")
      .where("userId", "==", userId)
      .where("endTime", "==", null)
      .limit(1)
      .get();

    if (!openSession.empty) {
      return res.status(409).json({ error: "User already has an active session" });
    }

    const sessionData = {
      userId,
      startTime: new Date(),
    };

    const ref = await db.collection("game_sessions").add(sessionData);

    return res.status(200).json({
      message: "Game session started",
      sessionId: ref.id,
      startedAt: sessionData.startTime.toISOString(),
    });

  } catch (err) {
    console.error("Failed to start game session:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};