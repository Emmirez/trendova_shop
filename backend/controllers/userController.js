import User from "../models/User.js";

// @GET /api/users — superadmin only
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @GET /api/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-__v");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/users/profile — logged in user
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, addresses } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, addresses },
      { new: true, runValidators: true },
    );

    res.json({ message: "Profile updated.", user: updated });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/users/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(currentPassword))) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
};

// @PATCH /api/users/:id/promote — superadmin only
export const promoteToAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.role === "superadmin") {
      return res
        .status(400)
        .json({ message: "Cannot modify superadmin role." });
    }

    user.role = "admin";
    await user.save({ validateBeforeSave: false });

    res.json({ message: `${user.name} has been promoted to admin.`, user });
  } catch (error) {
    next(error);
  }
};

// @PATCH /api/users/:id/demote — superadmin only
export const demoteToUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.role === "superadmin") {
      return res
        .status(400)
        .json({ message: "Cannot modify superadmin role." });
    }

    user.role = "user";
    await user.save({ validateBeforeSave: false });

    res.json({ message: `${user.name} has been demoted to user.`, user });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/users/:id — superadmin only
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.role === "superadmin") {
      return res.status(400).json({ message: "Cannot delete superadmin." });
    }

    await user.deleteOne();
    res.json({ message: `User ${user.name} has been deleted.` });
  } catch (error) {
    next(error);
  }
};
