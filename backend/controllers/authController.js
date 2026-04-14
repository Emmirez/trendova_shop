import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate tokens
const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES,
  });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });

// @POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "user",
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens = [refreshToken];
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      message: "Account created successfully.",
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select(
      "+password +refreshTokens",
    );
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account has been deactivated." });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(
      -5,
    );
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    res.json({
      message: "Login successful.",
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/refresh
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: 'Invalid or expired refresh token.' });
    }

    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ message: 'Refresh token not recognized.' });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    const newTokens = user.refreshTokens
      .filter(t => t !== refreshToken)
      .concat(newRefreshToken)
      .slice(-5);

    await User.findByIdAndUpdate(
      user._id,
      { $set: { refreshTokens: newTokens } },
      { new: true }
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const user = await User.findById(req.user._id).select("+refreshTokens");
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (t) => t !== refreshToken,
        );
        await user.save({ validateBeforeSave: false });
      }
    }

    res.json({ message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};

// @GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
