const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'HTML')));
app.use(express.static(path.join(__dirname, 'JS')));
app.use(express.static(path.join(__dirname, 'CSS')));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-email-password'  // Replace with your email password or app password
    }
});

// Handle complaint submission
app.post('/api/complaints', async (req, res) => {
    try {
        const { name, office, locality, type, description, complaintId } = req.body;

        // Save complaint to file
        const dataDir = path.join(__dirname, 'data');
        const filePath = path.join(dataDir, 'complaints.json');

        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir);
        }

        let data;
        try {
            const fileData = await fs.readFile(filePath, 'utf8');
            data = JSON.parse(fileData);
        } catch {
            data = { complaints: [] };
        }

        const newComplaint = {
            id: complaintId || `COMP-${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'Pending',
            name,
            office,
            locality,
            type,
            description
        };

        data.complaints.push(newComplaint);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));

        // Send email to admin
        const adminEmail = `${office.toLowerCase().replace(/\s+/g, '')}@mcms.com`; // Example email format
        const mailOptions = {
            from: 'your-email@gmail.com', // Replace with your email
            to: adminEmail,
            subject: `New Complaint Submitted: ${newComplaint.id}`,
            text: `
                A new complaint has been submitted:
                - Complaint ID: ${newComplaint.id}
                - Name: ${name}
                - Office: ${office}
                - Locality: ${locality}
                - Type: ${type}
                - Description: ${description}
                - Status: Pending
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, complaintId: newComplaint.id });
    } catch (error) {
        console.error('Error saving complaint or sending email:', error);
        res.status(500).json({ error: 'Failed to save complaint or send email' });
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