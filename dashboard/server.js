const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors'); // Ensure you run: npm install cors

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow frontend requests
app.use(express.json());

// Connect to the A.E.G.I.S. local database layer with resilient settings
const dbPath = path.resolve(__dirname, '../aegis_scaled_cluster.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Critical: Error connecting to A.E.G.I.S. telemetry database:', err.message);
    } else {
        console.log('Connected to A.E.G.I.S. decentralized telemetry store successfully.');
    }
});

// Telemetry Endpoint for Live Agent Monitoring
app.get('/api/v1/telemetry', (req, res) => {
    db.all("SELECT task_id, status FROM task_queue", [], (err, rows) => {
        if (err) {
            console.error("Database query failed:", err.message);
            return res.status(500).json({ error: "Internal telemetry failure, sir." });
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

// Graceful shutdown handling
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) console.error(err.message);
        console.log('A.E.G.I.S. Telemetry Command Center shutting down gracefully.');
        process.exit(0);
    });
});

app.listen(PORT, () => {
    console.log(`A.E.G.I.S. Telemetry Command Center active on port ${PORT}, sir.`);
});
