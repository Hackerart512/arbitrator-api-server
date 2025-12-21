export const checkPermission = (permissionName) => {
    return (req, res, next) => {
        const { role, permissions = [] } = req.user;

        console.log("Role Name:", role);
        console.log("Permissions:", permissions);

        // Super Admin bypass
        if (role === 'SuperAdmin') {
            return next();
        }

        if (!permissions.includes(permissionName)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
};
