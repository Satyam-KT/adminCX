import jwt from 'jsonwebtoken';

const JWT_SECRET = 'abcde';
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'password';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
