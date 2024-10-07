# Ribbonhood

This is a stock trading web app built with React + Vite, Typescript, TailwindCSS, Shadcn, Flask, and PostgreSQL.
It utilizes libraries such as D3 for data visualizations and yfinance for stock data.

## Project Setup Guide

This guide will help you set up both the backend and frontend of the project.

## Prerequisites

- Python 3.10 or later
- Node.js 18.12.0 or later
- npm 10.9.0 or later

## Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Create a virtual environment:

   ```
   python -m venv venv
   ```

3. Activate the virtual environment:

   - On Windows:
     ```
     "source venv/Scripts/activate" or ". venv/Scripts/activate"
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required packages:

   ```
   pip install -r requirements.txt
   ```

5. Set up the environment variables:

   - Create a `.env` file in the backend directory.
   - Copy the contents from `.env.sample` to `.env`.
   - Update the `.env` file with your actual database credentials.

6. Set up the database:

   > Note: The default database name is "ribbonhood". Ensure you don't have a database with this name, as the script will initially drop a database with the same name.

   > Note: Also the user should have the correct privileges to create a database.

   ```
   python utils/create_db.py
   ```

7. Start the backend server:
   ```
   flask run
   ```

## Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install the required npm packages:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Running the Application

1. Ensure that both the backend and frontend servers are running.
2. Open your web browser and navigate to the URL provided by the frontend development server (typically http://localhost:5173).
