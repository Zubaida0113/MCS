const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'HTML')));
app.use(express.static(path.join(__dirname, 'JS')));
app.use(express.static(path.join(__dirname, 'CSS')));

// Handle complaint submission
app.post('/api/complaints', async (req, res) => {
    try {
        const dataDir = path.join(__dirname, 'data');
        const filePath = path.join(dataDir, 'complaints.json');

        // Create data directory if it doesn't exist
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir);
        }

        // Create or read complaints file
        let data;
        try {
            const fileData = await fs.readFile(filePath, 'utf8');
            data = JSON.parse(fileData);
        } catch {
            data = { complaints: [] };
        }
        
        const newComplaint = {
            id: `COMP-${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'Pending',
            ...req.body
        };
        
        data.complaints.push(newComplaint);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        
        res.json(newComplaint);
    } catch (error) {
        console.error('Error saving complaint:', error);
        res.status(500).json({ error: 'Failed to save complaint' });
    }
});

// Get all complaints
app.get('/api/complaints', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'complaints.json');
        const fileData = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileData);
        res.json(data);
    } catch (error) {
        console.error('Error reading complaints:', error);
        if (error.code === 'ENOENT') {
            // If file doesn't exist, return empty complaints array
            res.json({ complaints: [] });
        } else {
            res.status(500).json({ error: 'Failed to fetch complaints' });
        }
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});