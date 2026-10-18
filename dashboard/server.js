const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the A.E.G.I.S. local database layer
const dbPath = path.resolve(__dirname, '../aegis_scaled_cluster.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to A.E.G.I.S. telemetry database, sir:', err.message);
    } else {
        console.log('Connected to A.E.G.I.S. decentralized telemetry store successfully.');
    }
});

app.use(express.json());

// Telemetry Endpoint for Live Agent Monitoring
app.get('/api/v1/telemetry', (req, res) => {
    db.all("SELECT * FROM task_queue", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            protocol: "Project A.E.G.I.S.",
            status: "Operational",
            active_nodes: rows.length,
            tasks: rows,
            timestamp: new Date().toISOString()
        });
    });
});

app.listen(PORT, () => {
    console.log(`A.E.G.I.S. Telemetry Command Center active on port ${PORT}, sir.`);
});
