# Emotus Cloud Computing Documentation

## Cloud Architecture
<img width="2706" alt="Untitled (7)" src="https://github.com/user-attachments/assets/980186ed-a46f-4c91-8f40-eb9e2e817fa6">

# Emotus Backend API Documentation

## Overview
Emotus is a comprehensive mood tracking and emotional wellness platform that helps users monitor, analyze, and understand their emotional states. The API provides sophisticated mood analysis, personalized recommendations, and detailed analytics to support users' emotional well-being journey.

## Base URL
```
https://emotus-backend-api-1089286517825.asia-southeast2.run.app/api
```

## Authentication
All endpoints require a user ID for request authentication and data isolation. The user ID must be included as a query parameter:
```
?userId=your_user_id
```

Example: `https://emotus-backend-api-1089286517825.asia-southeast2.run.app/api/moods?userId=user123`

## Endpoints

### Account Management

#### Register Account
```http
POST /account/register
```

Creates a new user account.

Request Body:
```json
{
  "username": "emotus",
  "password": "emotus2024",
  "email": "emotus@gmail.com" // Optional
}
```

Response:
```json
{
  "message": "Account created successfully",
  "userId": "user123"
}
```

#### Login
```http
POST /account/login
```

Login to the account.

Request Body:
```json
{
  "userId": "user123",
  "password": "emotus2024"
}
```

Response:
```json
{
  "userId": "user123",
  "message": "login successful"
}
```

#### Get Account Information
```http
GET /account?userId={userId}
```

Updates user account information.

Response:
```json
{
  "username": "emotus",
  "email": "emotus@gmail.com",
  "createdAt": "2024-12-07T12:10:01.736Z",
  "profilePhotoUrl": "https://storage.googleapis.com/emotus-project.firebasestorage.app/profile-photos/user17/bfc44846-b066-4078-90b5-8c1a9ffffcf5.png",
  "updatedAt": "2024-12-07T12:10:46.376Z"
}
```

#### Update Account Information
```http
PUT /account?userId={userId}
```
Updates user account information.

Request Body:
```json
{
  "username": "emotus mood",
  "email": "emotus@gmail.com"
}
```

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
- `diaryEntry` (required): Text description of the user's mood/day
Optional fields:
- `mood`: String (Happy, Sad, Angry, Fearful, Love)
- `stressLevel`: String (Low, Medium, High)

Response:
```json
{
  "id": "mood_entry_id",
  "diaryEntry": "Hari ini aku sangat senang karena diberikan hadiah dari orang tua",
  "mood": "Happy",
  "predictedMood": "Happy",
  "stressLevel": "Low",
  "sympathyMessage": "Sungguh luar biasa! Kamu bisa menjaga mood yang positif.",
  "thoughtfulSuggestions": [
    "Coba ambil waktu untuk refleksi dan bersyukur",
    "Bagikan cerita positifmu dengan orang terdekat",
    "Rencanakan aktivitas menyenangkan untuk besok"
  ],
  "thingsToDo": [
    "Bagikan senyuman dan kata-kata positif ke orang di sekitarmu",
    "Tulis 3 hal yang membuatmu bersyukur hari ini",
    "Rencanakan aktivitas seru untuk akhir pekan"
  ],
  "createdAt": "2024-03-14T08:30:45.000Z",
  "updatedAt": "2024-03-14T08:30:45.000Z"
}
```

#### Get Mood Entries
```http
GET /moods?userId={userId}&period={period}&startDate={startDate}&endDate={endDate}
```

Retrieves mood entries within a specified time range.

Query Parameters:
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `period` (optional): 'daily', 'weekly', 'monthly'

Response:
```json
{
  "data": [
    {
      "id": "mood_entry_123",
      "diaryEntry": "Hari ini aku sangat senang karena diberikan hadiah dari orang tua",
      "mood": "Happy",
      "predictedMood": "Happy",
      "stressLevel": Low,
      "createdAt": "2024-03-14T08:30:45.000Z"
    }
  ],
  "total": 1,
  "startDate": "2024-03-14T00:00:00.000Z",
  "endDate": "2024-03-14T23:59:59.999Z",
  "period": "daily"
}
```

#### Update Mood Entry
```http
PUT /moods/{entryId}?userId={userId}
```

Update mood entries

Request Body:
```json
{
  "diaryEntry": "Updated entry content"
}
```

#### Delete Mood Entry
```http
DELETE /moods/{entryId}?userId={userId}
```

Delete mood entries

### Analytics

#### Get Mood Trends
```http
GET /analytics/trends?userId={userId}&period={period}&startDate={startDate}&endDate={endDate}
```

Provides comprehensive mood analysis and trends.

Query Parameters:
- `period`: 'daily', 'weekly', 'monthly'
- `startDate` (optional): Custom start date
- `endDate` (optional): Custom end date

Response:
```json
{
  "period": "monthly",
  "startDate": "2024-03-01T00:00:00.000Z",
  "endDate": "2024-03-31T23:59:59.999Z",
  "moodDistribution": {
    "Happy": { "count": 15, "percentage": 50 },
    "Sadness": { "count": 6, "percentage": 20 },
    "Love": { "count": 9, "percentage": 30 }
  },
  "stressLevelTrend": [
    {
      "date": "2024-03-14T08:30:45.000Z",
      "stressLevel": 2,
      "mood": "Happy"
    }
  ],
  "commonTriggers": [
    {
      "trigger": "work",
      "frequency": 8
    },
    {
      "trigger": "family",
      "frequency": 5
    }
  ],
  "timeOfDayAnalysis": {
    "morning": 10,
    "afternoon": 12,
    "evening": 6,
    "night": 2
  }
}
```

#### Get Daily/Weekly/Monthly Summary
```http
GET /analytics/summary?userId={userId}&period={period}
```

Provides a comprehensive summary of mood patterns and personalized insights.

Query Parameters:
- `period`: daily, weekly, monthly (optional, defaults to daily)

Response:
```json
{
  "startDate": "2024-03-14T00:00:00.000Z",
  "endDate": "2024-03-14T23:59:59.999Z",
  "totalEntries": 3,
  "dominantMood": "Happy",
  "dominantStressLevel": "Low",
  "sympathyMessage": "Sungguh luar biasa! Kamu bisa menjaga mood yang positif.",
  "thoughtfulSuggestions": [
    "Coba ambil waktu untuk refleksi dan bersyukur",
    "Bagikan cerita positifmu dengan orang terdekat",
    "Rencanakan aktivitas menyenangkan untuk besok"
  ],
  "helpfulHint": "Saat kamu bahagia, bagikan energi positifmu dengan orang lain.",
  "feelInspire": "Kebahagiaanmu adalah cerminan dari usaha dan cara kamu melihat dunia.",
  "summary": "Anda mencatat 3 entri suasana hati selama periode ini. Suasana hati Anda yang dominan adalah Happy dengan tingkat stres yang didominasi Low. Pertimbangkan untuk meninjau kembali saran-saran bijaksana yang diberikan untuk mempertahankan atau meningkatkan kesejahteraan emosional Anda."
}
```

### Daily Tips and Recommendations

#### Get Daily Tip
```http
GET /daily-tips?userId={userId}
```

Provides personalized daily tips based on mood patterns.

Response:
```json
{
  "dominantMood": "Happy",
  "stressLevel": "low",
  "entriesCount": 2,
  "Take a Moment for Yourself": "Hei, energi positifmu hari ini sangat berharga! Mari luangkan waktu sejenak untuk mensyukuri momen bahagia ini.",
  "Kind Reminder": "Kebahagiaan adalah pilihan, dan hari ini kamu sudah memilih untuk bahagia.",
  "Quick Activity": "Tuliskan 3 hal yang membuatmu tersenyum hari ini",
  "Relaxation Exercise": "Mari maksimalkan mood baikmu dengan latihan mindfulness..."
}
```

### User Profile

#### Upload Profile Photo
```http
POST /users/photo?userId={userId}
```
Uploads a user profile photo.

Form Data:
- `photo`: Image file (max 5MB, image formats only)

Response:
```json
{
  "imageUrl": "https://storage.googleapis.com/emotus-project.firebasestorage.app/profile-photos/user123/photo.jpg"
}
```

#### Delete Profile Photo
```http
DELETE /users/photo?userId={userId}
```

Delete user profile photo.

Response:
```json
{
  "message": "Profile photo deleted successfully"
}
```

### Notifications

#### Update Notification Settings
```http
PUT /notifications/settings?userId={userId}
```
Configures user notification preferences.

Request Body:
```json
{
  "moodReminders": true,
  "weeklySummary": true,
  "dailyReminders": true,
  "reminderTimes": ["09:00", "15:00", "21:00"]
}
```

## Data Models

### Mood Types
- `Happy`: Positive, joyful emotions
- `Sadness`: Feelings of sadness or melancholy
- `Fear`: Anxiety or fear-based emotions
- `Love`: Feelings of love or affection
- `Anger`: Frustration or anger-based emotions

### Stress Levels
- `Low`: (Minimal stress)
- `Medium`: (Moderate stress)
- `High`: (Significant stress)

## Error Handling

The API uses standard HTTP status codes and provides detailed error messages:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

Common Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

To ensure API stability and fair usage:

- Standard endpoints: 100 requests/minute/user
- File uploads: 10 uploads/hour/user
- Analytics endpoints: 30 requests/minute/user

## Security Features

1. Input Validation
   - All user inputs are sanitized and validated
   - File uploads are scanned for malware
   - Size limits enforced on all requests

2. Data Protection
   - All data is stored in secure Firebase storage
   - User data is isolated by userId
   - Sensitive data is encrypted at rest

3. Access Control
   - Each request requires valid userId
   - Resource access is restricted to owners
   - File access uses signed URLs

### Time Periods
- `daily`: Current day
- `weekly`: Last 7 days
- `monthly`: Last 30 days

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

### Testing Endpoints

Using cURL:
```bash
# Create mood entry
curl -X POST "https://emotus-backend-api-1089286517825.asia-southeast2.run.app/api/moods?userId=user123" \
  -H "Content-Type: application/json" \
  -d '{
    "diaryEntry": "Today was productive!",
    "mood": "Happy",
    "stressLevel": 2
  }'

# Get mood entries
curl "https://emotus-backend-api-1089286517825.asia-southeast2.run.app/api/moods?userId=user123"

# Get analytics
curl "https://emotus-backend-api-1089286517825.asia-southeast2.run.app/api/analytics/trends?userId=user123"
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
   - `userId`: user1

## Data Validation

1. Account
   - Username: 3-30 characters
   - Password: Minimum 6 characters
   - Email: Optional, valid email format if provided

2. Mood Entries
   - Diary Entry: Required, non-empty string

3. Dates
   - Format: YYYY-MM-DD
   - Time ranges: startDate must be before endDate
   - Future dates not allowed

4. Files
   - Profile photos: Max 5MB
   - Supported formats: image/jpeg, image/png
   - Aspect ratio: 1:1 recommended

5. Notifications
   - Reminder times: 24-hour format (HH:mm)
   - Maximum 5 reminder times per user
   - Boolean flags for notification types

# Cloud Computing Tools
![Untitled design (20)](https://github.com/user-attachments/assets/21407885-508f-491f-a0a6-7162241754e1)
### Visual Studio Code
<p align="justify">
Visual Studio Code serves as our primary IDE for writing and debugging backend code. Its lightweight and powerful features streamlined our development process.
</p>

### Node.js / ExpressJS
<p align="justify">
Node.js with ExpressJS powers our backend API. It helps manage routes, handle HTTP requests, and integrates seamlessly with other components of the app.
</p>

### Google Cloud Platform
<p align="justify">
Google Cloud provides the infrastructure for our app. We use Cloud Run to deploy the backend API and Cloud Firestore for secure and scalable data storage, enabling the app to handle growing user demands efficiently.
</p>

### Firebase
<p align="justify">
We are using Firebase for real-time data synchronization, ensuring that user data, mood entries, and other app-related information are always up-to-date across devices.
</p>

### Postman
<p align="justify">
Postman is used to test and debug our APIs, ensuring that data flow and responses work as expected before deployment.
</p>

# Cloud Services Used
## Deployment
- <img src="https://github.com/user-attachments/assets/1c24dc96-d22f-474e-b24d-db0b4aadcf15" width="400" />
<p align="justify">
The backend API and machine learning model are both deployed on Cloud Run, enabling serverless and scalable management of requests. The backend API, built with Express.js, efficiently handles routing and backend logic, while the machine learning model processes user inputs to provide real-time mood predictions and personalized recommendations, seamlessly interacting with the backend API.
</p>

## Database & Storage
- <img src="https://github.com/user-attachments/assets/29b5e7ff-a6c5-4036-9cf4-dc6694d21a7e" width="400" />
- <img src="https://github.com/user-attachments/assets/a44a27ee-9e5c-42f8-83e0-47e51a6f980b" width="400" />
<p align="justify">
1.Cloud Firestore is used as a scalable and high-performance irelational database for storing user mood entries, recommendations, and app-related data.
</p>
<p align="justify">
2.Cloud Storage handles media files, such as user-uploaded images, ensuring secure and efficient file management.
</p>
