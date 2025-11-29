const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const componentRoutes = require('./routes/componentRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('BattleStation API Online');
});

app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
