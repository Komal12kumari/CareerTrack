const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  console.log("---- AUTH MIDDLEWARE CALLED ----");

  // 1️⃣ Check if Authorization header exists
  if (req.headers.authorization) {
    console.log("Authorization Header:", req.headers.authorization);
  } else {
    console.log("No Authorization header received");
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2️⃣ Extract token
      token = req.headers.authorization.split(" ")[1];
      console.log("Extracted Token:", token);

      // 3️⃣ Check if JWT_SECRET exists
      console.log("JWT_SECRET:", process.env.JWT_SECRET);

      // 4️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);

      // 5️⃣ Find user
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("JWT ERROR:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};