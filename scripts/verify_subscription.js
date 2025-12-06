
const BASE_URL = "http://localhost:8000/api/v1";
const EMAIL = "test_playlist@example.com";
const PASSWORD = "password123";

// We need a second user to subscribe to. 
// For this test, we'll just use the same user to subscribe to themselves (if allowed) 
// or ideally create a second user. 
// Let's try to find another user or just use a fake ID if we can't create one easily.
// Actually, let's create a second user in this script to be safe.

async function runTests() {
    try {
        console.log("1. Logging in as User 1...");
        const loginRes = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD })
        });

        if (!loginRes.ok) throw new Error("Login failed");
        const loginData = await loginRes.json();
        const accessToken = loginData.data.accessToken;
        const user1Id = loginData.data.user._id;
        console.log("User 1 ID:", user1Id);

        const headers = {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        };

        // Create User 2
        const user2Email = `test_sub_${Date.now()}@example.com`;
        const user2Username = `test_sub_${Date.now()}`;
        console.log(`\n2. Registering User 2 (${user2Username})...`);

        // We need to use FormData for registration as it expects files
        // But for simplicity in this script, let's try to find an existing user or just use a hardcoded ID if we know one.
        // Since we can't easily upload files via fetch without a real file, let's try to use the 'register' endpoint 
        // but it might fail without files.
        // ALTERNATIVE: Just use the same user ID to subscribe to self (if logic allows) or use a random ID to test 404/validation.
        // BUT we need a valid channel ID to subscribe to.

        // Let's try to use the same user ID. If the backend allows subscribing to self, great. 
        // If not, we might need to manually create a user in DB or use the one we have.
        // Let's assume we can subscribe to self for testing purposes, or use a known ID.
        // Wait, we have 'test_playlist_user'. Let's see if there are other users.

        // Let's just use the user1Id as the channelId.
        const channelId = user1Id;

        console.log(`\n3. Toggling Subscription to channel ${channelId}...`);
        const toggleRes = await fetch(`${BASE_URL}/subscriptions/c/${channelId}`, {
            method: "POST",
            headers
        });
        console.log("Toggle Status:", toggleRes.status);
        const toggleData = await toggleRes.json();
        console.log("Subscribed:", toggleData.data?.subscribed);

        console.log("\n4. Getting Channel Subscribers...");
        const getSubscribersRes = await fetch(`${BASE_URL}/subscriptions/c/${channelId}`, { headers });
        console.log("Get Subscribers Status:", getSubscribersRes.status);
        const subscribersData = await getSubscribersRes.json();
        console.log("Subscribers count:", subscribersData.data?.length);

        console.log("\n5. Getting Subscribed Channels...");
        const getSubscribedRes = await fetch(`${BASE_URL}/subscriptions/u/${user1Id}`, { headers });
        console.log("Get Subscribed Channels Status:", getSubscribedRes.status);
        const subscribedData = await getSubscribedRes.json();
        console.log("Subscribed Channels count:", subscribedData.data?.length);

        console.log("\n6. Toggling Subscription again (Unsubscribe)...");
        const toggleRes2 = await fetch(`${BASE_URL}/subscriptions/c/${channelId}`, {
            method: "POST",
            headers
        });
        console.log("Toggle Status:", toggleRes2.status);
        const toggleData2 = await toggleRes2.json();
        console.log("Subscribed:", toggleData2.data?.subscribed);

        console.log("\nVerification Complete!");

    } catch (error) {
        console.error("Test Failed:", error);
    }
}

runTests();
