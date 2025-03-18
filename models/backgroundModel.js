const pool = require("../config/database/db.js");

const saveBackground = async (imagePath) => {
  const result = await pool.query(
    "INSERT INTO backgrounds (image_url) VALUES ($1) RETURNING *",
    [imagePath]
  );
  return result.rows[0];
};

const getBackground = async () => {
  const result = await pool.query("SELECT * FROM backgrounds ORDER BY id DESC LIMIT 1");
  return result.rows[0] || null;
};

const getAllBackgrounds = async () => {
    const result = await pool.query("SELECT * FROM backgrounds ORDER BY id DESC");
    return result.rows;
  };
  
  module.exports = { saveBackground, getBackground, getAllBackgrounds };
  
