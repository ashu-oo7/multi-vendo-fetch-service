# 🏗️ Multi-Vendor Data Fetch Service

This project builds a unified backend service to fetch data from multiple vendors, some synchronous and some asynchronous. It handles queuing, rate-limiting, and response tracking, providing a clean internal API to hide vendor-specific behavior.

---

## 🚀 How to Run This (Windows + Docker)

### 1. Prerequisites

- ✅ Docker Desktop installed and running
- ✅ MongoDB installed and running **locally** (on port 27017)
- ✅ Redis Cloud account (Free Tier) with:
  - `REDIS_USERNAME`
  - `REDIS_PASSWORD`
  - `REDIS_HOST`
  - `REDIS_PORT`
- ✅ `.env` file created in the root of the project

### 2. Example `.env`

REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_HOST=redis-xxxx.cXXX.us-east-1-X.ec2.cloud.redislabs.com
REDIS_PORT=12345
MONGO_URL=mongodb://host.docker.internal:27017

> Note: Use `host.docker.internal` to allow Docker containers to access MongoDB on your Windows host.

### 3. Run the Project

```bash
docker-compose up --build

All components (API, Worker, Webhook, Vendors) will start in containers. You can now test the APIs.

## 🌐 API Endpoints
POST /jobs – Accepts a JSON job payload. Returns a request_id.

GET /jobs/:request_id – Returns job status and result (if complete).

POST /vendor-webhook/:vendor – Endpoint used by async vendor to push result back.


## Architecture Diagram :

                 +----------------------+
                 |     Frontend /      |
                 |  Internal Clients    |
                 +----------+----------+
                            |
                            v
                   +--------+--------+
                   |     API Server   |
                   +--------+--------+
                            |
                            v
                +-----------+-----------+
                |      Redis Stream     |  ← Queue
                +-----------+-----------+
                            |
                            v
                  +---------+---------+
                  |       Worker       |
                  +---------+---------+
                            |
        +-------------------+-------------------+
        |                                       |
        v                                       v
+---------------+                    +-------------------+
|  Sync Vendor  |                    |   Async Vendor     |
| (Immediate)   |                    | (Delayed via hook) |
+---------------+                    +-------------------+
        |                                       |
        v                                       v
+---------------+                     +------------------+
|   MongoDB     | <-----------------  | Webhook Handler  |
+---------------+    Final Result     +------------------+


## 🧠 Key Design Decisions

🧵 Redis Streams for job queuing – supports reliability, ordering, and persistence.

🗃️ MongoDB stores job status and results for easy lookup.

🔄 Sync vs Async Vendors:

Sync vendors respond immediately.

Async vendors delay response and call a webhook.

🧪 Mock vendors simulate real-world external APIs.

🐳 Docker Compose spins up everything together – fully isolated and repeatable.
```
