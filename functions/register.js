const db = require("./db");
const { v4: uuidv4 } = require("uuid");

module.exports = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const id = uuidv4();
  await db.collection("users").doc(id).set({ username, password });
  res.status(201).json({ message: "User registered", user: { id, username } });
};