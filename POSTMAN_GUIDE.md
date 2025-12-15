# Postman Testing Guide

This guide will help you test the APIs required for the backend using Postman.

## 1. Environment Setup

Create a new Environment in Postman (e.g., "ChaiBackend local") with the following variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `server_url` | `http://localhost:8000` | `http://localhost:8000` |
| `accessToken` | (leave empty) | (will be populated automatically or manually) |

---

## 2. Authentication

### Register User
*   **Method**: `POST`
*   **URL**: `{{server_url}}/api/v1/users/register`
*   **Body**: `form-data`
    *   `username`: `your_username`
    *   `email`: `your_email@example.com`
    *   `fullName`: `Your Name`
    *   `password`: `password123`
    *   `avatar`: (File) Select an image
    *   `coverImage`: (File) Select an image (optional)

### Login User
*   **Method**: `POST`
*   **URL**: `{{server_url}}/api/v1/users/login`
*   **Body**: `raw` (JSON)
    ```json
    {
        "username": "your_username",
        "password": "password123"
    }
    ```
*   **Tests**: Add this script to the "Tests" tab to automatically save the token:
    ```javascript
    if (pm.response.code === 200) {
        var jsonData = pm.response.json();
        pm.environment.set("accessToken", jsonData.data.accessToken);
        console.log("Access Token set automatically");
    }
    ```

---

## 3. Admin Routes (Secured)

**Prerequisite**: The logged-in user must be an **admin**.
Run the script to promote a user if you haven't already:
```bash
node scripts/make_admin.js <your_username>
```

**Authorization**:
For all requests below, go to the **Authorization** tab, select **Bearer Token**, and use `{{accessToken}}`.

### Get System Stats
*   **Method**: `GET`
*   **URL**: `{{server_url}}/api/v1/admin/stats`
*   **Description**: Returns total users, videos, views, etc.

### Get All Users
*   **Method**: `GET`
*   **URL**: `{{server_url}}/api/v1/admin/users`

### Delete Any Video
*   **Method**: `DELETE`
*   **URL**: `{{server_url}}/api/v1/admin/video/:videoId`
*   **Description**: Delete a video by ID even if you are not the owner.

---

## 4. Video Routes

**Authorization**: Bearer Token required (`{{accessToken}}`).

### Publish Video
*   **Method**: `POST`
*   **URL**: `{{server_url}}/videos/publish`
*   **Body**: `form-data`
    *   `title`: `My Video Title`
    *   `description`: `Video description`
    *   `video`: (File) Select a video file
    *   `thumbnail`: (File) Select an image file

### Get All Videos
*   **Method**: `GET`
*   **URL**: `{{server_url}}/videos/`

---

## 5. Tweet Routes

**Authorization**: Bearer Token required (`{{accessToken}}`).

### Create Tweet
*   **Method**: `POST`
*   **URL**: `{{server_url}}/api/v1/tweets`
*   **Body**: `raw` (JSON)
    ```json
    {
        "content": "This is a test tweet!"
    }
    ```

### Get User Tweets
*   **Method**: `GET`
*   **URL**: `{{server_url}}/api/v1/tweets/user/:userId`

---

## 6. Healthcheck

*   **Method**: `GET`
*   **URL**: `{{server_url}}/api/v1/healthcheck`
*   **Response**: `{ "status": "OK", ... }`
