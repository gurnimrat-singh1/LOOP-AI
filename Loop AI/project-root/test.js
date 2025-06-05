const axios = require("axios");

async function test() {
    const payload1 = { ids: [1, 2, 3, 4, 5], priority: "MEDIUM" };
    const payload2 = { ids: [6, 7, 8, 9], priority: "HIGH" };

    const res1 = await axios.post("http://localhost:5000/ingest", payload1);
    const res2 = await axios.post("http://localhost:5000/ingest", payload2);

    console.log("Submitted:", res1.data, res2.data);

    setInterval(async () => {
        const status1 = await axios.get(`http://localhost:5000/status/${res1.data.ingestion_id}`);
        const status2 = await axios.get(`http://localhost:5000/status/${res2.data.ingestion_id}`);
        console.log("\nStatus MEDIUM:", status1.data);
        console.log("Status HIGH:", status2.data);
    }, 3000);
}

test();