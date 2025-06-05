const store = {};

function setBatches(ingestionId, batches) {
    store[ingestionId] = { ingestion_id: ingestionId, batches };
}

function updateBatchStatus(ingestionId, batchId, status) {
    const ingestion = store[ingestionId];
    const batch = ingestion?.batches.find(b => b.batch_id === batchId);
    if (batch) batch.status = status;
}

function getStatus(ingestionId) {
    const ingestion = store[ingestionId];
    if (!ingestion) return null;

    let overall = "completed";
    const statuses = ingestion.batches.map(b => b.status);

    if (statuses.every(s => s === "yet_to_start")) overall = "yet_to_start";
    else if (statuses.some(s => s === "triggered")) overall = "triggered";
    
    return { ingestion_id: ingestionId, status: overall, batches: ingestion.batches };
}

module.exports = { setBatches, updateBatchStatus, getStatus };
