const jwt = require("jsonwebtoken");
const pool = require("../database/db");

exports.protect = async (req, res, next) => {
  const token = req.cookies.token;

  const query = await pool.query(
    `
      SELECT * FROM chat.blacklist
      WHERE jwt = $1
    `,
    [token]
  );

  if (query.rows.length > 0) {
    console.log("Token found in blacklist");
    return res.redirect("/");
  }

  if (!token) {
    console.log("Token not found");
    return res.redirect("/");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.redirect("/login");
      }

      console.log(`Logged as ${decoded.user}`);
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error("Invalid Token: ", err);
    return res.redirect("/login");
  }
};
