# upRaqx

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Variables](#environment-variables)
4. [Running the Application](#running-the-application)
5. [Usage](#usage)
6. [API Documentation](#api-documentation)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm (Node Package Manager) Node.js: Version 18 or higher.
- You have npm: Installed with Node.js for managing dependencies.
- You have a code editor, preferably Visual Studio Code.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Aditya-Dev-01/upRaqx.git
   ```

2. **Navigate to the frontend project directory:**

   ```bash
   cd frontend
   ```

3. **Navigate to the backend project directory:**

   ```bash
   cd backend
   ```

4. **Install the dependencies:**

   ```bash
   npm install
   ```

## Environment Variables

To set up environment variables, follow these steps:

1. Create a `.env` file in the frontend directory of your project.
2. Add your environment-specific variables in the `.env` file.

   ```bash
   NEXT_PUBLIC_BASE_URL=http://localhost:8080/api/
   NEXT_PUBLIC_SERVER_URL=ttp://localhost:8080
   ```

3. Create a `.env` file in the backend directory of your project.
4. Add your environment-specific variables in the `.env` file.

   ```bash
   PORT=8080
   MONGODB_URI=mongodb+srv://abcd:jUWWHxiQVATiA04w@cluster0.zfzgq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   SECRETEKEY=SECRETEKEY
   # login id:-john@gmail.com
   # password:-john@1234
    ```

## Running the Application

To run the application locally, use the following command:

1. To start the frontend server run the following command & Open your browser and navigate to http://localhost:3000:

```bash
npm run dev
```

2. To start the backend server run the following command Open your browser and navigate to http://localhost:8080:

```bash
npm run dev
```

## Usage

To use the application, follow these steps:

1. **Start the Backend Server:**

   - Begin by starting the backend server.

2. **Start the Frontend Server:**
   - Once the backend server is running, start the frontend server to use the application.

## API Documentation

The backend includes Swagger documentation for the API. You can access it via:

http://localhost:8080/api/docs

This will provide an interface to view and test all available API endpoints.
