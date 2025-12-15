
const BASE_URL = "http://localhost:8000/api/v1";

async function runTests() {
    try {
        // 1. Check Healthcheck
        console.log("\nChecking Healthcheck...");
        const res = await fetch(`${BASE_URL}/healthcheck`);
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Message:", data.message);

        if (res.status !== 200 || data.message !== "OK") {
            throw new Error("Healthcheck failed");
        }

        console.log("\nHealthcheck Passed!");
        process.exit(0);

    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
}

runTests();
