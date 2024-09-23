import jwt from 'jsonwebtoken';
import Intern from '../../../models/internModel.js'; // Adjust the path as needed
import { connectToDatabase } from '../../utils/connectToDatabase.js';

const JWT_SECRET = 'abcde';

// Middleware function for JWT authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token missing' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token verification failed' });
        req.user = user;
        next();
    });
};

// DELETE route handler for deleting an intern
export const deleteIntern = async (req, res) => {
    const { internId } = req.params; // Get internId from URL parameters

    try {
        await connectToDatabase(); // Connect to the database
        const result = await Intern.deleteOne({ internId });

        if (result.deletedCount > 0) {
            return res.status(200).json({ message: 'Intern deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Intern not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting intern', error });
    }
};

// Route handler for admin actions
export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        authenticateToken(req, res, () => deleteIntern(req, res)); // Call deleteIntern with token authentication
    } else {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
