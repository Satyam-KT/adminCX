import mongoose from 'mongoose';

const internSchema = new mongoose.Schema({
    internId: String,
    name: String,
    startDate: Date,
    email: String,
    whatsappNumber: String,
    attendance: [{ date: Date, marked: Boolean }],
    tasks: [{ date: Date, description: String }]
});

export default mongoose.models.Intern || mongoose.model('Intern', internSchema);
