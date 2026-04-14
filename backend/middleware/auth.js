import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Not authorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired." });
      }
      return res.status(401).json({ message: "Invalid token." });
    }

    const user = await User.findById(decoded.id).select("+passwordChangedAt");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account has been deactivated." });
    }

    if (user.passwordChangedAfter(decoded.iat)) {
      return res
        .status(401)
        .json({ message: "Password recently changed. Please login again." });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
