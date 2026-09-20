# TEN Assessment Platform - Backend

Java Spring Boot + MySQL backend for the college assessment platform.

## Requirements
- Java 17+
- Maven
- MySQL 8.0

## 1. Create database

In MySQL:

```sql
CREATE DATABASE assessment_platform;
```

## 2. Configure MySQL password

Edit:

`src/main/resources/application.properties`

and replace:

`YOUR_MYSQL_PASSWORD`

with your local MySQL root password.

Do not commit real passwords to GitHub.

## 3. Run

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

or, if Maven is installed:

```powershell
mvn spring-boot:run
```

Backend runs at:

`http://localhost:8080`

## Main APIs

### Tests
GET `/api/tests`
GET `/api/tests/{id}`
POST `/api/tests`
PUT `/api/tests/{id}`
DELETE `/api/tests/{id}`
PUT `/api/tests/{id}/questions`

### Questions
GET `/api/questions`
GET `/api/questions?ids=q-101,q-102`
POST `/api/questions`
PUT `/api/questions/{id}`
DELETE `/api/questions/{id}`

### Candidates
GET `/api/candidates`
GET `/api/candidates/{id}`
POST `/api/candidates`
PUT `/api/candidates/{id}`
DELETE `/api/candidates/{id}`

### Results
GET `/api/results`
GET `/api/results/{id}`
GET `/api/results/candidate/{candidateId}`
GET `/api/results/test/{testId}`
POST `/api/results/submit`

## Important

This is the first backend integration version. The frontend still uses its localStorage mock services. After the backend is verified, update the frontend services to call these REST APIs.

Authentication, reports, leaderboard, notifications, and production security can be added in the next integration stage.
