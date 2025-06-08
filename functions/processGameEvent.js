const db = require("./db");

module.exports = async (req, res) => {
  try {
    const event = req.body;

    if (!event || !event.userId || !event.type) {
      return res.status(400).json({ error: "Missing required fields: userId and type" });
    }

    const eventData = {
      userId: event.userId,
      type: event.type,
      payload: event.payload || {},     
      createdAt: new Date(),
    };

    const ref = await db.collection("game_events").add(eventData);
    console.log(`Game event stored with ID ${ref.id}:`, eventData);

    return res.status(200).json({
      message: "Game event processed",
      eventId: ref.id,
    });
  } catch (err) {
    console.error("Error processing game event:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};