require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

// connect to MongoDB
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// static public
app.use(express.static(path.join(__dirname, 'public')));

// api routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/assessments', require('./src/routes/assessments'));
app.use('/api/training', require('./src/routes/training'));
app.use('/api/mentorship', require('./src/routes/mentorship'));
app.use('/api/jobs', require('./src/routes/jobs'));

app.get('/api/health', (req, res) => res.json({ ok: true, time: Date.now() }));

app.listen(PORT, () => {
  console.log(`CareerConnect server running on port ${PORT}`);
});
