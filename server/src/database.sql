CREATE TABLE teacher(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    surname VARCHAR(255),
    course_id INTEGER,
    FOREIGN KEY (course_id) REFERENCES courses (id)
);