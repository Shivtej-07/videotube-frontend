
const BASE_URL = "http://localhost:8000/api/v1";
const EMAIL = "test_playlist@example.com";
const PASSWORD = "password123";
const FAKE_VIDEO_ID = "507f1f77bcf86cd799439011";

async function runTests() {
    try {
        console.log("1. Logging in...");
        const loginRes = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD })
        });

        if (!loginRes.ok) {
            const text = await loginRes.text();
            throw new Error(`Login failed: ${loginRes.status} ${text}`);
        }

        const loginData = await loginRes.json();
        const accessToken = loginData.data.accessToken;
        const userId = loginData.data.user._id;
        console.log("Login successful. User ID:", userId);

        const headers = {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        };

        console.log("\n2. Creating Playlist...");
        const createRes = await fetch(`${BASE_URL}/playlists`, {
            method: "POST",
            headers,
            body: JSON.stringify({ name: "My Test Playlist", description: "A playlist for testing" })
        });
        console.log("Create Playlist Status:", createRes.status);
        const createText = await createRes.text();
        let createData;
        try {
            createData = JSON.parse(createText);
        } catch (e) {
            console.error("Failed to parse JSON:", createText);
            throw new Error(`Failed to parse JSON response: ${createText}`);
        }

        if (!createRes.ok) {
            console.error(JSON.stringify(createData, null, 2));
            throw new Error("Failed to create playlist");
        }
        const playlistId = createData.data?._id;
        console.log("Playlist ID:", playlistId);

        if (!playlistId) throw new Error("Failed to create playlist");

        console.log("\n3. Getting User Playlists...");
        const getUserPlaylistsRes = await fetch(`${BASE_URL}/playlists/user/${userId}`, { headers });
        console.log("Get User Playlists Status:", getUserPlaylistsRes.status);
        const userPlaylistsData = await getUserPlaylistsRes.json();
        console.log("Playlists count:", userPlaylistsData.data?.length);

        console.log("\n4. Getting Playlist by ID...");
        const getByIdRes = await fetch(`${BASE_URL}/playlists/${playlistId}`, { headers });
        console.log("Get By ID Status:", getByIdRes.status);

        console.log("\n5. Updating Playlist...");
        const updateRes = await fetch(`${BASE_URL}/playlists/${playlistId}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ name: "Updated Playlist Name", description: "Updated description" })
        });
        console.log("Update Status:", updateRes.status);

        console.log("\n6. Adding Video to Playlist...");
        const addVideoRes = await fetch(`${BASE_URL}/playlists/add/${FAKE_VIDEO_ID}/${playlistId}`, {
            method: "PATCH",
            headers
        });
        console.log("Add Video Status:", addVideoRes.status);
        const addVideoData = await addVideoRes.json();
        if (!addVideoRes.ok) console.error(addVideoData);

        console.log("\n7. Removing Video from Playlist...");
        const removeVideoRes = await fetch(`${BASE_URL}/playlists/remove/${FAKE_VIDEO_ID}/${playlistId}`, {
            method: "PATCH",
            headers
        });
        console.log("Remove Video Status:", removeVideoRes.status);

        console.log("\n8. Deleting Playlist...");
        const deleteRes = await fetch(`${BASE_URL}/playlists/${playlistId}`, {
            method: "DELETE",
            headers
        });
        console.log("Delete Status:", deleteRes.status);

        console.log("\nVerification Complete!");

    } catch (error) {
        console.error("Test Failed:", error);
        const fs = await import('fs');
        fs.writeFileSync('error.log', `Test Failed: ${error.message}\n${error.stack}`);
    }
}

runTests();
