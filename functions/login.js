const db = require("./db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "dev-secret-key";

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const snapshot = await db.collection("users")
      .where("username", "==", username)
      .where("password", "==", password)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const token = jwt.sign({ userId: userDoc.id, username: user.username }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userDoc.id,
        username: user.username,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};