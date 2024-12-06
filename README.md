# Emotus API Documentation

## Overview
Emotus is a mood tracking and analytics API that helps users record, track, and analyze their emotional states. The API provides endpoints for mood entries, analytics, notifications, user management, and account settings.

## Base URL
```
https://emotus-backend-api-1089286517825.asia-southeast2.run.app/api
```

## Authentication
All endpoints require a user ID parameter. Pass the user ID as a query parameter:
```
?userId=your_user_id
```

Example: `http://localhost:8080/api/moods?userId=user100`

## Endpoints

### Mood Entries

#### Create Mood Entry
```http
POST /moods?userId={userId}
```

Request Body:
```json
{
  "diaryEntry": "Today was a great day! I accomplished all my tasks."
}
```

Required fields:
- `diaryEntry`: String
Optional fields:
- `mood`: String (Happy, Sad, Angry, Fearful, Love)
- `stressLevel`: String (Low, Medium, High)

Response:
```json
{
  "id": "mood_entry_id",
  "diaryEntry": "Today was a great day! I accomplished all my tasks.",
  "mood": "Happy",
  "predictedMood": "Happy",
  "stressLevel": "Low",
  "sympathyMessage": "Sungguh luar biasa! Kamu bisa menjaga mood yang positif.",
  "thoughtfulSuggestions": [...],
  "thingsToDo": [...],
  "createdAt": "2024-03-14T08:30:45",
  "updatedAt": "2024-03-14T08:30:45"
}
```

#### Get Mood Entries
```http
GET /moods?userId={userId}&startDate={startDate}&endDate={endDate}
```

Query Parameters:
- `startDate`: YYYY-MM-DD (optional)
- `endDate`: YYYY-MM-DD (optional)

Response:
```json
[
  {
    "id": "mood_entry_id",
    "diaryEntry": "...",
    "mood": "Happy",
    "stressLevel": "Low",
    "createdAt": "2024-03-14T08:30:45",
    "updatedAt": "2024-03-14T08:30:45"
  }
]
```

#### Update Mood Entry
```http
PUT /moods/{entryId}?userId={userId}
```

Request Body:
```json
{
  "diaryEntry": "Updated entry content",
  "mood": "Love",
  "stressLevel": "Low"
}
```

#### Delete Mood Entry
```http
DELETE /moods/{entryId}?userId={userId}
```

### Analytics

#### Get Mood Trends
```http
GET /analytics/trends?userId={userId}&startDate={startDate}&endDate={endDate}
```

Response:
```json
{
  "moodDistribution": {
    "Happy": { "count": 5, "percentage": 50 },
    "Sadness": { "count": 2, "percentage": 20 },
    "Anger": { "count": 1, "percentage": 10 },
    "Fear": { "count": 1, "percentage": 10 },
    "Love": { "count": 1, "percentage": 10 }
  },
  "stressLevelTrend": [...],
  "commonTriggers": [...],
  "timeOfDayAnalysis": {
    "morning": 3,
    "afternoon": 4,
    "evening": 2,
    "night": 1
  }
}
```

#### Get Daily Summary
```http
GET /analytics/summary?userId={userId}&period={period}
```

Query Parameters:
- `period`: daily, weekly, monthly (optional, defaults to daily)

### Account Management

#### Save Account Information
```http
POST /account?userId={userId}
```

Request Body:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get Account Information
```http
GET /account?userId={userId}
```

#### Update Account Information
```http
PUT /account?userId={userId}
```

### User Profile

#### Upload Profile Photo
```http
POST /users/photo?userId={userId}
```

Form Data:
- `photo`: Image file (max 5MB, image formats only)

#### Delete Profile Photo
```http
DELETE /users/photo?userId={userId}
```

### Notifications

#### Update Notification Settings
```http
PUT /notifications/settings?userId={userId}
```

Request Body:
```json
{
  "moodReminders": true,
  "weeklySummary": true,
  "dailyReminders": true,
  "reminderTimes": ["09:00", "15:00", "21:00"]
}
```

## Testing the API

### Prerequisites
1. Node.js and npm installed
2. Firebase project credentials
3. API testing tool (Postman, cURL, or similar)

### Environment Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with required credentials:
   ```
   PORT=8080
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY=your_private_key
   NODE_ENV=development
   FIRESTORE_DATABASE_ID=your_database_id
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Testing with cURL

1. Create a mood entry:
```bash
curl -X POST "https://emotus-backend-api-1089286517825.asia-southeast2.run.app/api/moods?userId=user100" \
  -H "Content-Type: application/json" \
  -d '{
    "diaryEntry": "Today was productive!",
    "mood": "Happy",
    "stressLevel": 3
  }'
```

2. Get mood entries:
```bash
curl "https://emotus-backend-api-1089286517825.asia-southeast2.run.app/api/moods?userId=user100"
```

3. Get analytics:
```bash
curl "https://emotus-backend-api-1089286517825.asia-southeast2.run.app/api/analytics/trends?userId=user100"
```

### Testing with Postman

1. Import the following collection:
```json
{
  "info": {
    "name": "Emotus API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Mood Entry",
      "request": {
        "method": "POST",
        "url": "https://emotus-backend-api-1089286517825.asia-southeast2.run.app/api/moods?userId=user100",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"diaryEntry\": \"Test entry\",\n  \"mood\": \"Happy\",\n  \"stressLevel\": \"low\"n}"
        }
      }
    }
  ]
}
```

2. Set up environment variables in Postman:
   - `baseUrl`: https://emotus-backend-api-1089286517825.asia-southeast2.run.app/api
   - `userId`: user100

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

Error Response Format:
```json
{
  "error": "Error message description"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per user ID

## Data Validation

All endpoints implement input validation:
- Dates must be in YYYY-MM-DD format
- Mood values must be one of: Happy, Sad, Angry, Love, Fearful
- Stress levels must be one of: Low, Medium, High
- File uploads limited to 5MB
- Username length: 3-30 characters
- Password minimum length: 6 characters
