const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../database/db");

const createWebToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      user: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

exports.register = async (req, res) => {
  const { email, user, password, name } = req.body;

  const query = await pool.query(
    `
    SELECT * FROM chat.user WHERE username = $1
    `,
    [user]
  );

  if (query.rows.length > 0) {
    console.log("User already in use");
    return res.status(400).json({ message: "User already in use" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  await pool.query(
    `
    INSERT INTO chat.user (username, email, name, password) VALUES ($1, $2, $3, $4)
    `,
    [user, email, name, hashedPassword]
  );

  const newUser = {
    id: this.lastID,
    email: email,
    user: user,
  };

  return res.status(201).json({ message: "User registered successfully" });
};

exports.login = async (req, res) => {
  const { user, password } = req.body;

  const query = await pool.query(
    `
    SELECT * FROM chat.user WHERE username = $1
    `,
    [user]
  );

  if (query.rows.length === 0) {
    console.log("User not found, register now!");
    return res.status(400).json({ message: "User not found, register now!" });
  }

  const foundUser = query.rows[0];
  const checkPassword = bcrypt.compareSync(password, foundUser.password);

  if (!checkPassword) {
    console.log("Invalid Credentials");
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const token = createWebToken(foundUser);
  console.log(token);
  res.cookie("token", token, {
    httoOnly: true,
    secure: true,
    maxAge: 3600000,
    sameSite: "None",
  });

  console.log(`Logged as ${foundUser.username}`);
  return res.status(201).json({ token });
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "Token não fornecido" });
    }

    const query = await pool.query(
      `
    INSERT INTO chat.blacklist (jwt)
    VALUES ($1)
    `,
      [token]
    );

    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error("Erro no logout:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};
