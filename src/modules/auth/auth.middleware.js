import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ success: false, message: 'Token missing' });

    const token = authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ success: false, message: 'Invalid token format' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // id, role, is_super_admin
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message:
                err.name === 'TokenExpiredError'
                    ? 'Token has expired'
                    : 'Invalid token'
        });
    }
};

export default authMiddleware;
