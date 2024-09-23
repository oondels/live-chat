const jwt = require("jsonwebtoken");
const pool = require("../database/db");

exports.protect = async (req, res, next) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  const query = await pool.query(
    `
      SELECT * FROM chat.blacklist
      WHERE jwt = $1
    `,
    [token]
  );

  if (query.rows.length > 0) {
    console.log("Token found in blacklist");
    return res.status(401).json({
      message: "Invalid Token. Redirecting...",
      redirect: "/login",
    });
  }

  if (!token) {
    console.log("Token not found");
    return res.status(401).json({
      message: "Token not found. Redirecting...",
      redirect: "/login",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.status(401).json({
          message: "Token not found. Redirecting...",
          redirect: "/login",
        });

      console.log(`Logged as ${decoded.user}`);
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error("Invalid Token: ", err);
    return res.redirect("/login");
  }
};
