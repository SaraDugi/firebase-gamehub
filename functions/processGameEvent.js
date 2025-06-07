module.exports = async (req, res) => {
  const event = req.body;
  console.log("Processing game event:", event);
  res.status(200).json({ message: "Game event processed" });
};