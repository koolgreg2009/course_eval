import psycopg2
import pandas as pd
import math
import re
import os
from dotenv import load_dotenv

load_dotenv()
# Helper function to convert Nan to NULL
def safe_float(val):
    return None if pd.isna(val) or (isinstance(val, float) and math.isnan(val)) else float(val)

def safe_int(val):
    return None if pd.isna(val) or (isinstance(val, float) and math.isnan(val)) else int(val)

df = pd.read_csv("../data/course_evals_data.csv")

# conn = psycopg2.connect(
#     os.environ.get("DATABASE_URL"),
# )

conn = psycopg2.connect(
    host="localhost",
    dbname="course_eval",
    user="kevinhu",
    password=""
)
cur = conn.cursor()
count = 0
cols = [
    "dept", "division", "course", "lastName", "firstName", "term", "year",
    "INS1", "INS2", "INS3", "INS4", "INS5", "INS6",
    "ARTSC1", "ARTSC2", "ARTSC3",
    "invited", "responses"
]

for _, row in df.iterrows():
    (
        dept, division, course_raw, last_name, first_name, term, year,
        ins1, ins2, ins3, ins4, ins5, ins6,
        artsc1, artsc2, artsc3,
        invited, responses
    ) = row[cols]

    try:
        # Insert prof. cuz of foreign key constraint if we insert a prof we need to insert its respective
        # id into offering. So we need to get prof_ID each time.
        cur.execute("""
            SELECT prof_id 
            FROM professors
            WHERE first_name = %s AND last_name = %s
        """, (first_name, last_name))
        prof = cur.fetchone()
        if prof:
            prof_id =  prof[0]
        else:
            cur.execute("""
            INSERT INTO professors (first_name, last_name) 
            VALUES (%s, %s) RETURNING prof_id
            """, (first_name, last_name))
            prof_id = cur.fetchone()[0]

        ### 2. Parse course code (e.g., CSC263H1-F-LEC5101)
        course_parts = course_raw.strip().split(" ")
        if course_parts[-1][0] == '(':
            # Some courses are titled: Quantitative Methods Economics ECO220Y1-Y-LEC0101 (A)
            # Just removed the () lol
            course_parts.pop(-1)
        code_with_suffix = course_parts[-1]                     # e.g. 'AFR389H1-F-LEC5101'

        code_split = code_with_suffix.split("-")
        # course_code = code_split[0]
        match = re.search(r"[A-Za-z]{3}[0-9]{3}[HY][0-9]", course_raw)
        course_code = match.group() if match else ''
        course_section = code_split[-1]
        title = " ".join(course_parts[:-1])                     # e.g. 'Africa-China Economic Relation'
        if course_code in title:
            # for cases like: Software Design CSC207H1 - LEC0101
            title = title.replace(course_code, '').replace('-', '').strip()

    # Insert into courses table
        cur.execute("""
                    SELECT course_id FROM courses WHERE code = %s
                    """, (course_code,))
        course = cur.fetchone()
        if course:
            course_id = course[0]
        else:
            cur.execute("""
                        INSERT INTO courses (department, code, title)
                        VALUES (%s, %s, %s) RETURNING course_id
                        """, (dept, course_code, title))
            course_id = cur.fetchone()[0]

        # Insert into offerings table or get offering_id

        cur.execute("""
                    SELECT offering_id 
                    FROM offerings
                    WHERE prof_id = %s AND course_id = %s AND year = %s AND semester = %s AND section = %s
                    """, (prof_id, course_id, year, term, course_section))
        offering = cur.fetchone()
        if offering:
            offering_id = offering[0]
        else:
            cur.execute("""
                        INSERT INTO offerings (prof_id, course_id, section, year, semester)
                        VALUES (%s, %s, %s, %s, %s) RETURNING offering_id
                        """, (prof_id, course_id, course_section, year, term))
            offering_id = cur.fetchone()[0]

        #. Insert evaluation
        cur.execute("""
                    INSERT INTO evaluations (
                        offering_id, ins1, ins2, ins3, ins4, ins5, ins6,
                        artsci1, artsci2, artsci3, invited, responded
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        offering_id,
                        safe_float(ins1), safe_float(ins2), safe_float(ins3),
                        safe_float(ins4), safe_float(ins5), safe_float(ins6),
                        safe_float(artsc1), safe_float(artsc2), safe_float(artsc3),
                        safe_int(invited), safe_int(responses)
                    ))

    except Exception as e:
        # print("Error inserting row:")
        # print(course_parts)
        # print("code_split =", code_split)
        # print("course_section =", course_section)
        print("Inserting evaluation with values:")
        print("offering_id:", offering_id)
        print("INS scores:", ins1, ins2, ins3, ins4, ins5, ins6)
        print("ARTSC scores:", artsc1, artsc2, artsc3)
        print("invited:", invited, "responses:", responses)
        print (row[cols])
        raise
    count += 1
    print(count)

conn.commit()
cur.close()
conn.close()


