
# UofT Course Evaluation Search Platform

A full stack web app for exploring University of Toronto course evaluation data by **course** or **professor**.

[Click here for to visit site](https://course-eval-frontend.onrender.com/)

## Basic Functions

- **Search by course**
  - View evaluation scores for a course across different professors
  - See recent and historical offerings

- **Search by professor**
  - View evaluation scores across all courses taught by a professor
  - Compare teaching performance across courses

- **Aggregate results**
  - Show summary metrics instead of only raw evaluations
  - Make course/prof comparisons easier

- **Demo mode**
  - Default is demo mode, press command/control + shift + '/' to toggle to 2025 data. 



## Architecture Overview

This project uses a standard full stack architecture:


Frontend (React)
    ↓ HTTP API calls
Backend (Node.js + Express)
    ↓ SQL queries
Database (PostgreSQL)


### Frontend
- Built with **React**
- Handles search UI, result views, and user interactions

### Backend
- Built with **Node.js + Express**
- Exposes API endpoints for course/professor search
- Processes requests and queries the database

### Database
- **PostgreSQL**
- Stores course, professor, offering, and evaluation-related data

### Optional Data Pipeline
- A **Python scraper** can be used to collect and prepare evaluation data for the database



## Tech Stack

- **Frontend:** React, Tailwind CSS, DaisyUI
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Optional:** Python scraper for data ingestion



## Goal

Make course evaluation data easier to explore than traditional professor-only review platforms by supporting both **course-first** and **professor-first** search.
