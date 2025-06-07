const db = require("./db");

module.exports = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }
  const snapshot = await db.collection("users").where("username", "==", username).where("password", "==", password).get();
  if (snapshot.empty) return res.status(401).json({ error: "Invalid credentials" });
  res.status(200).json({ message: "Login successful", userId: snapshot.docs[0].id });
};