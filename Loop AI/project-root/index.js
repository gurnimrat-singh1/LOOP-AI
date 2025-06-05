const express = require("express");
const { v4: uuidv4 } = require("uuid");
const queueManager = require("./queueManager");
const statusStore = require("./statusStore");

const app = express();
app.use(express.json());

// Ingest Endpoint
app.post("/ingest", (req, res) => {
    const { ids, priority } = req.body;
    const ingestionId = uuidv4();
    queueManager.enqueue(ingestionId, ids, priority);
    res.json({ ingestion_id: ingestionId });
});

// Status Endpoint
app.get("/status/:ingestionId", (req, res) => {
    const ingestionId = req.params.ingestionId;
    const status = statusStore.getStatus(ingestionId);
    res.json(status || { error: "Ingestion ID not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
