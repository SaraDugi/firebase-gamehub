const db = require("./db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      !username || !password ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({ error: "Invalid or missing fields" });
    }

    const trimmedUsername = username.trim();

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const existing = await db.collection("users")
      .where("username", "==", trimmedUsername)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    await db.collection("users").doc(id).set({
      username: trimmedUsername,
      passwordHash,
      createdAt: new Date(),
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id, username: trimmedUsername },
    });

  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};