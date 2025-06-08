const functions = require("firebase-functions");
const db = require("./db");

// Podatkovne spremembe
module.exports = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    const userId = context.params.userId;

    console.log(`New user created: ${userId}`, userData);

    const batch = db.batch();
    const profileRef = db.collection("profiles").doc(userId);
    batch.set(profileRef, {
      username: userData.username || "Unnamed",
      level: 1,
      exp: 0,
      createdAt: new Date(),
    });

    const notificationRef = db.collection("notifications").doc();
    batch.set(notificationRef, {
      userId,
      message: "Welcome to the game!",
      type: "info",
      createdAt: new Date(),
      read: false,
    });

    await batch.commit();
    console.log("Default profile and welcome notification created.");
  });