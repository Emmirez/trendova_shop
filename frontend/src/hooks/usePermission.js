/* eslint-disable no-unused-vars */
import useAuth from "./useAuth";
import { ROLES } from "../context/roles";

const usePermission = () => {
  const { user, hasRole, hasAnyRole } = useAuth();

  return {
    // Role checks
    isSuperAdmin: user?.role === ROLES.SUPERADMIN,
    isAdmin: hasAnyRole(ROLES.ADMIN, ROLES.SUPERADMIN),
    isUser: !!user,

    // Feature permissions
    canManageProducts: hasAnyRole(ROLES.ADMIN, ROLES.SUPERADMIN),
    canManageOrders: hasAnyRole(ROLES.ADMIN, ROLES.SUPERADMIN),
    canManageUsers: user?.role === ROLES.SUPERADMIN,
    canPromoteUsers: user?.role === ROLES.SUPERADMIN,
    canDeleteUsers: user?.role === ROLES.SUPERADMIN,
    canViewAnalytics: hasAnyRole(ROLES.ADMIN, ROLES.SUPERADMIN),
    canViewOwnOrders: !!user,
    canEditOwnProfile: !!user,

    // Generic checker
    can: (permission) => {
      const permissions = {
        'manage:products': hasAnyRole(ROLES.ADMIN, ROLES.SUPERADMIN),
        'manage:orders': hasAnyRole(ROLES.ADMIN, ROLES.SUPERADMIN),
        'manage:users': user?.role === ROLES.SUPERADMIN,
        'promote:users': user?.role === ROLES.SUPERADMIN,
        'delete:users': user?.role === ROLES.SUPERADMIN,
        'view:analytics': hasAnyRole(ROLES.ADMIN, ROLES.SUPERADMIN),
        'view:allOrders': hasAnyRole(ROLES.ADMIN, ROLES.SUPERADMIN),
        'view:ownOrders': !!user,
        'edit:profile': !!user,
      };
      return permissions[permission] ?? false;
    },
  };
};

export default usePermission;