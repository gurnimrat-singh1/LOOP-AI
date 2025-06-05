const { v4: uuidv4 } = require("uuid");
const statusStore = require("./statusStore");
const processor = require("./processor");

const priorities = { HIGH: 1, MEDIUM: 2, LOW: 3 };
let queue = [];

function enqueue(ingestionId, ids, priority) {
    const timestamp = Date.now();
    const batches = [];

    for (let i = 0; i < ids.length; i += 3) {
        const batch = {
            batch_id: uuidv4(),
            ids: ids.slice(i, i + 3),
            status: "yet_to_start",
            ingestion_id: ingestionId,
            created_time: timestamp,
            priority: priorities[priority],
        };
        queue.push(batch);
        batches.push(batch);
    }

    queue.sort((a, b) => a.priority - b.priority || a.created_time - b.created_time);
    statusStore.setBatches(ingestionId, batches);
}

setInterval(() => {
    const batch = queue.shift();
    if (batch) {
        batch.status = "triggered";
        statusStore.updateBatchStatus(batch.ingestion_id, batch.batch_id, "triggered");
        processor.process(batch).then(() => {
            statusStore.updateBatchStatus(batch.ingestion_id, batch.batch_id, "completed");
        });
    }
}, 5000); // Process one batch every 5 seconds

module.exports = { enqueue };
