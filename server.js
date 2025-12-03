const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
const db = require('./db');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_this_in_production';

app.use(cors());
app.use(express.json());

// Run DB migration on startup (creates tables if they don't exist)
try {
    const migrationPath = path.join(__dirname, 'scripts', 'create_tables.sql');
    if (fs.existsSync(migrationPath)) {
        const sql = fs.readFileSync(migrationPath, 'utf8');
        db.query(sql, (err) => {
            if (err) {
                console.error('[migration] Error running create_tables.sql:', err);
            } else {
                console.log('[migration] create_tables.sql ran successfully (tables ensured)');
            }
        });
    } else {
        console.log('[migration] No migration file found at', migrationPath);
    }
} catch (e) {
    console.error('[migration] Unexpected error while running migrations:', e);
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.userId = decoded.id;
        req.username = decoded.username;
        next();
    });
};

// Authentication Routes
app.post('/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log('[/auth/register] request body:', { username, email });

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const checkSql = "SELECT * FROM users WHERE email = ? OR username = ?";
        db.query(checkSql, [email, username], async (err, data) => {
            if (err) {
                console.error('[/auth/register] DB error (check user):', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (data.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            try {
                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert user
                const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
                db.query(sql, [username, email, hashedPassword], (err, result) => {
                    if (err) {
                        console.error('[/auth/register] DB error (insert user):', err);
                        return res.status(500).json({ error: 'Database error' });
                    }

                    const token = jwt.sign(
                        { id: result.insertId, username: username },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    return res.json({
                        message: 'User registered successfully',
                        token: token,
                        user: { id: result.insertId, username: username, email: email }
                    });
                });
            } catch (hashErr) {
                console.error('[/auth/register] Hashing error:', hashErr);
                return res.status(500).json({ error: 'Server error' });
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('[/auth/login] request body:', { email });

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], async (err, data) => {
            if (err) {
                console.error('[/auth/login] DB error (select user):', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (data.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = data[0];
            try {
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }

                const token = jwt.sign(
                    { id: user.id, username: user.username },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );

                return res.json({
                    message: 'Login successful',
                    token: token,
                    user: { id: user.id, username: user.username, email: user.email }
                });
            } catch (compareErr) {
                console.error('[/auth/login] Password compare error:', compareErr);
                return res.status(500).json({ error: 'Server error' });
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.post('/auth/logout', (req, res) => {
    return res.json({ message: 'Logout successful' });
});

// Protected Routes for Movies

// Protected Routes for Movies
app.get('/movies', verifyToken, (req, res) => {
    const sql = "SELECT * FROM movies WHERE userId = ?";
    db.query(sql, [req.userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.post('/movies', verifyToken, (req, res) => {
    const sql = "INSERT INTO movies (userId, title, genre, rating, feedback, watched) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
        req.userId,
        req.body.title,
        req.body.genre,
        req.body.rating,
        req.body.feedback,
        req.body.watched || false
    ];
    
    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Movie added", id: data.insertId });
    });
});

app.delete('/movies/:id', verifyToken, (req, res) => {
    const sql = "DELETE FROM movies WHERE id = ? AND userId = ?";
    const id = req.params.id;

    db.query(sql, [id, req.userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) {
            return res.status(403).json({ error: 'Movie not found or unauthorized' });
        }
        return res.json("Movie deleted");
    });
});

app.put('/movies/:id', verifyToken, (req, res) => {
    const sql = "UPDATE movies SET title = ?, genre = ?, rating = ?, feedback = ?, watched = ? WHERE id = ? AND userId = ?";
    const id = req.params.id;
    const values = [req.body.title, req.body.genre, req.body.rating, req.body.feedback, req.body.watched, id, req.userId];

    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) {
            return res.status(403).json({ error: 'Movie not found or unauthorized' });
        }
        return res.json("Movie updated");
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});