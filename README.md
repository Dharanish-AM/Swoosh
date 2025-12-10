# Swoosh ⚡️

**Swoosh** is a full-stack solution for instant, secure, QR-driven peer-to-peer file sharing. It allows users to create rooms, share files seamlessly between devices, and manage user interactions with a focus on speed and security.

## 🚀 Features

- **Instant File Sharing**: Share files quickly between devices.
- **QR Code Integration**: logical and physical device pairing via QR codes for easy room joining.
- **Secure Transfers**: Built with security in mind (JWT Authentication).
- **Room Management**: Create and join rooms for isolated sharing sessions.
- **User Management**: Authentication and user profiles.
- **Dual Backend Architecture**: Choose between a Monolithic or Microservices approach.

## 🛠 Tech Stack

### Frontend (`/client`)

- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM 7
- **Icons**: Lucide React, React Icons

### Backend

The project offers two backend implementations:

1. **Monolith (`/server/swoosh`)**
    - **Framework**: Spring Boot 3.5.5
    - **Database**: MySQL
    - **Security**: Spring Security + JWT
    - **Build Tool**: Maven

2. **Microservices (`/swoosh-microservice`)**
    - **Framework**: Spring Cloud
    - **Services**:
        - `api-gateway`: Entry point for the system.
        - `discovery-service`: Service registry (Eureka).
        - `auth-service`: Authentication and Identity management.
        - `user-service`: User profile management.
        - `file-service`: Handling file uploads and downloads.
        - `room-service`: Managing real-time rooms.

## 🏁 Getting Started

### Prerequisites

- Node.js & npm (for Client)
- Java 17+ (for Backend)
- Maven
- MySQL Database

### 1. Client Setup

1. Navigate to the client directory:

    ```bash
    cd client
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

    The app will run at `http://localhost:5173`.

### 2. Backend Setup

#### Option A: Monolith (Recommended for simpler setup)

1. Navigate to the monolith server directory:

    ```bash
    cd server/swoosh
    ```

2. Configure database properties in `src/main/resources/application.properties` (if needed).
3. Run the application:

    ```bash
    ./mvnw spring-boot:run
    ```

    The server typically starts on port `8080` (or `8000` as per client config).

#### Option B: Microservices

1. Navigate to the microservices directory:

    ```bash
    cd swoosh-microservice
    ```

2. You will need to start the services in the following order:
    - `discovery-service`
    - `api-gateway`
    - Other services (`auth`, `user`, `file`, `room`)
3. Navigate to each service directory and update configuration then run:

    ```bash
    ../mvnw spring-boot:run
    ```

## 📂 Project Structure

```
Swoosh/
├── client/                 # React Frontend
├── server/
│   └── swoosh/             # Spring Boot Monolith
├── swoosh-microservice/    # Spring Cloud Microservices
│   ├── api-gateway/
│   ├── auth-service/
│   ├── discovery-service/
│   ├── file-service/
│   ├── room-service/
│   └── user-service/
└── ...
```