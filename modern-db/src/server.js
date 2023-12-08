const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {join} = require("path");

const app = express();
const port = 3001;

app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Credentials',
        ],
    })
);

// ... other imports and middleware
app.use(express.static(path.join(__dirname, 'build')));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(join(__dirname, 'build', 'index.html'));
});


const uri =
    'mongodb+srv://intellectuals:bqxPvhoPfNR1MTkP@moderndbfinalprojectuse.o0k3p1f.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('moderndbfinalprojectUsers');
        const collectionNames = await db.listCollections().toArray();
        const collectionExists = collectionNames.some(
            (collection) => collection.name === 'users'
        );

        if (!collectionExists) {
            await db.createCollection('users');
            console.log('Created users collection');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'yourSecretKey', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


// Route to check the server status
app.get('/api/status', (req, res) => {
    res.json({ status: 'Server is running' });
});


// Route to log in a user
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = client.db('moderndbfinalprojectUsers');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, sameSite: true });
        res.json({ message: 'Login successful', user, token });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to register a user
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = client.db('moderndbfinalprojectUsers');
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { username, password: hashedPassword };
        await usersCollection.insertOne(newUser);

        res.json({ message: 'User registered successfully', user: newUser });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to log out a user
app.post('/api/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

// Connect to the database and start the server
connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
