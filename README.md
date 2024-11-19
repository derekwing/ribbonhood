# Ribbonhood

This is a stock trading app that allows users to buy and sell stocks, and look up real-time information regarding a stock. It is built with React + Vite, Typescript, TailwindCSS, Shadcn, Flask, and PostgreSQL.
It utilizes libraries such as D3 for data visualizations and yfinance for stock data.

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
