import jwt from 'jsonwebtoken';

const JWT_SECRET = 'abcde';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // If the authorization header is missing
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Extract the token from the 'Bearer <token>' format
    const token = authHeader.split(' ')[1];

    // If the token is missing
    if (!token) {
        return res.status(401).json({ message: 'Token missing from header' });
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err); // Log error for debugging
            return res.status(403).json({ message: 'Token verification failed' });
        }

        // Attach user to the request if token is valid
        req.user = user;
        next();
    });
};
