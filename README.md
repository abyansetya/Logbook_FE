# Logbook Frontend

## Overview
The Logbook frontend application provides a modern and responsive user interface for managing logbook entries, documents, and partners. It is built using React Router 7, Vite, and Tailwind CSS. The interface components are based on Radix UI, providing accessible and customizable building blocks.

## Technology Stack
- **Framework:** React and React Router 7
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Components:** Radix UI / Shadcn UI
- **State Management:** TanStack React Query
- **Form Handling:** React Hook Form and Zod
- **Language:** TypeScript

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js (v22 or higher recommended)
- npm or yarn package manager

## Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

## Configuration
Create a `.env` file in the root of the frontend directory. Use the `.env.example` file (if available) as a template. Ensure the following variables are set appropriately for your environment:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Running the Application
To start the development server, run the following command:
```bash
npm run dev
```
The application will be available at standard local Vite ports, typically `http://localhost:5173`.

## Building for Production
To create a production build of the frontend, execute:
```bash
npm run build
```
Once built, you can serve the application using:
```bash
npm run start
```

## Code Quality
Run formatting and type checking with the following commands:
```bash
npm run typecheck
```

## License
Proprietary. All rights reserved.
