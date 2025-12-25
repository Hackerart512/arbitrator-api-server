import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*'
        }
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error('Unauthorized'));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // userId, role, permissions
            next();
        } catch (err) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.user.userId);

        // Join case room
        socket.on('join_case', (caseId) => {
            socket.join(`case_${caseId}`);
        });

        socket.on('leave_case', (caseId) => {
            socket.leave(`case_${caseId}`);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    });

    return io;
};
