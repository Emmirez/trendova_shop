export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({
      message: 'This action requires superadmin privileges.',
    });
  }
  next();
};

export const isAdminOrSuperAdmin = (req, res, next) => {
  if (!['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({
      message: 'This action requires admin privileges.',
    });
  }
  next();
};