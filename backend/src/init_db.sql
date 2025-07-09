DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS offerings;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS professors;

CREATE TABLE professors (
        prof_id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        UNIQUE (first_name, last_name)
    );

CREATE TABLE courses (
     course_id SERIAL PRIMARY KEY,
     department TEXT NOT NULL,               -- eg. CSC
     code TEXT NOT NULL,     -- eg. 263H1 Together form CSC263H1
     title TEXT,
     UNIQUE (department, code)
);

CREATE TABLE offerings (
   offering_id SERIAL PRIMARY KEY,
   prof_id INTEGER REFERENCES professors(prof_id),
   course_id INTEGER REFERENCES courses(course_id),
   section TEXT NOT NULL, -- eg. 5101 for LEC5101
   year INTEGER NOT NULL,
   semester TEXT NOT NULL,     -- e.g. 'Fall', 'Winter', 'Summer'
   UNIQUE (prof_id, course_id, section, year, semester)  -- prevents duplicate rows
);

CREATE TABLE evaluations (
     eval_id SERIAL PRIMARY KEY,
     offering_id INTEGER REFERENCES offerings(offering_id),
     ins1 REAL,
     ins2 REAL,
     ins3 REAL,
     ins4 REAL,
     ins5 REAL,
     ins6 REAL,
     artsci1 REAL,
     artsci2 REAL,
     artsci3 REAL,
     invited INTEGER,
     responded INTEGER
);

CREATE TABLE search_log (
    log_id SERIAL PRIMARY KEY,
    search_category VARCHAR(20) NOT NULL, -- 'course' or 'professor'
    search_view VARCHAR(10) NOT NULL, -- 'eval' or 'aggregate'
    search_term TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- psql course_eval < backend/src/init_db.sql