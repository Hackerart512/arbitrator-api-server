import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token missing'
        });
    }
 
    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
        req.user = {
            id: decoded.userId,    
            role: decoded.role,
            permissions: decoded.permissions || []
        };

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
