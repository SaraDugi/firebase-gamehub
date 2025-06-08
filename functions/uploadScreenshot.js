const db = require("./db");

//Shramba in datoteke
module.exports = async (object) => {
  if (!object || !object.name) {
    console.warn("Storage event received with missing object or name.");
    return;
  }

  const { name, contentType, size, timeCreated } = object;

  await db.collection("uploads").add({
    fileName: name,
    contentType: contentType || "unknown",
    size: size || 0,
    uploadedAt: new Date(timeCreated || Date.now()),
  });

  console.log("File uploaded and metadata saved:", name);
};