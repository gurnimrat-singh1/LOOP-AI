function mockExternalAPI(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id, data: "processed" });
        }, 1000);
    });
}

async function process(batch) {
    await Promise.all(batch.ids.map(mockExternalAPI));
}

module.exports = { process };
