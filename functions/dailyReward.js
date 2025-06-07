const db = require("./db");

module.exports = async () => {
  const snapshot = await db.collection("users").get();
  const now = new Date();
  for (const doc of snapshot.docs) {
    await db.collection("rewards").add({ userId: doc.id, reward: "Daily Bonus", date: now });
  }
  console.log("Daily rewards granted.");
};