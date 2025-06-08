const db = require("./db");

//Sporočila in obveščanje Časovni dogodki
module.exports = async () => {
  const snapshot = await db.collection("users").get();
  const now = new Date();
  const dateString = now.toISOString().split("T")[0]; 

  let granted = 0;

  for (const doc of snapshot.docs) {
    const userId = doc.id;

    const existing = await db.collection("rewards")
      .where("userId", "==", userId)
      .where("dateString", "==", dateString)
      .limit(1)
      .get();

    if (!existing.empty) {
      console.log(`User ${userId} already received reward today.`);
      continue;
    }

    await db.collection("rewards").add({
      userId,
      reward: "Daily Bonus",
      date: now,
      dateString,
    });

    granted++;
  }
  console.log(`Daily rewards granted to ${granted} users.`);
};