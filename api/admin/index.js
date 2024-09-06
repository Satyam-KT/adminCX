import { authenticateToken } from './middleware';
import Intern from '../../models/internModel.js';  // Adjust the path as needed
import { connectToDatabase } from '../utils/connectToDatabase.js';

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

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await authenticateToken(req, res, async () => { // Apply the middleware here
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