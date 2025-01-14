# Showstack

Showstack is a full-stack application that includes a portfolio and a page rank visualizer. The frontend is built using React, Vite, and Material UI, while the backend is powered by FastAPI and deployed using Docker on Google Cloud Run.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Deployment](#deployment)
  - [Frontend Deployment](#frontend-deployment)
  - [Backend Deployment](#backend-deployment)
- [Usage](#usage)

## Project Structure

The project is organized into two main folders:

- `backend-stack`: Contains the backend code.
- `frontend-stack`: Contains the frontend code.

## Features

- **Portfolio**: Displays my projects, skills, and experiences.
- **Page Rank Visualizer**: Visualize the page rank of different web pages.

## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A build tool that aims to provide a faster and leaner development experience for modern web projects.
- **Material UI**: A popular React UI framework.

### Backend

- **FastAPI**: A modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.
- **Docker**: A platform to develop, ship, and run applications inside containers.
- **Google Cloud Run**: A managed compute platform that automatically scales.

## Getting Started

### Prerequisites

- Node.js and npm (for frontend)
- Python 3.7+ (for backend)
- Docker (for backend deployment)

### Installation

#### Frontend

1. Navigate to the `frontend-stack` directory:
   ```sh
   cd frontend-stack
2. Install the dependencies:
   ```sh
   npm install
3. Start the development server:
   ```sh
   npm run dev


#### Backend

1. Navigate to the `backend-stack` directory:
   ```sh
   cd backend-stack
2. Build the docker image:
   ```sh
   docker build -t backend-stack .
3. Run the docker image:
   ```sh
    docker run -p 8080:8080 backend-stack


### Deployment

#### Frontend deployment

The frontend is automatically deployed to Vercel whenever a commit is made to the repository.

#### Backend deployment

1. Navigate to the `backend-stack` directory:
   ```sh
   cd backend-stack
2. Build the docker image:
   ```sh
   docker build -t backend-stack .
3. Push the Docker image to Google Container Registry:
   ```sh
   docker tag showstack-backend gcr.io/amirthalingam/backend-stack
   docker push gcr.io/amirthalingam/backend-stack
4. Deploy to Google Cloud Run:
   ```sh
   gcloud run deploy backend-stack --image gcr.io/amirthalingam/backend-stack --platform managed --region asia-south1 --allow-unauthenticated

### Usage
1. Portfolio: The portfolio is accessible at the root page - https://www.amirth.dev/
2. Page Rank Visualizer: The Page Rank Visualizer is accessible at https://www.amirth.dev/page-rank
