import jwt from 'jsonwebtoken';
import Intern from '../../models/internModel.js'; // Adjust the path as needed
import { connectToDatabase } from '../utils/connectToDatabase.js';

const JWT_SECRET = 'abcde';

// Middleware function for JWT authentication
const authenticateToken = (req, res, next) => {
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

// Function to calculate the days palette
const calculateDaysPalette = (startDate, attendanceRecords) => {
    const daysPalette = [];
    const start = new Date(startDate);
    const current = new Date();

    // Iterate through 28 days from the start date
    for (let i = 0; i < 28; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        
        // Check if the day is within the current date
        if (day <= current) {
            const marked = attendanceRecords.some(record => new Date(record.date).toDateString() === day.toDateString() && record.marked);
            daysPalette.push({ date: day, marked });
        }
    }

    return daysPalette;
};

// Route handler for /api/admin/admin
export default async function handler(req, res) {
    if (req.method === 'GET') {
        authenticateToken(req, res, async () => { // Apply the middleware here
            try {
                await connectToDatabase();
                const interns = await Intern.find();

                // Prepare the attendance palette for each intern
                const internData = interns.map(intern => {
                    const daysPalette = calculateDaysPalette(intern.startDate, intern.attendance);
                    return {
                        internId: intern.internId,
                        name: intern.name,
                        startDate: intern.startDate,
                        attendance: daysPalette,
                        tasks: intern.tasks
                    };
                });

                res.status(200).json(internData);
            } catch (error) {
                res.status(500).json({ message: 'Error fetching interns data', error });
            }
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
