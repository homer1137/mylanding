CREATE TABLE users(
    name VARCHAR(55),
    surname VARCHAR(55),
    email VARCHAR(255),
    authorised boolean,
    id SERIAL PRIMARY KEY
);

CREATE TABLE videos(
    title VARCHAR(55),
    link VARCHAR(255),
    type VARCHAR(255),
    id SERIAL PRIMARY KEY
);



CREATE TABLE access(
    user_id integer,
    video_id integer,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (video_id) REFERENCES videos (id),
    access boolean,
    id SERIAL PRIMARY KEY
);

CREATE TABLE tokens(
    user_id integer,
    FOREIGN KEY (user_id) REFERENCES users (id),
    refresh_token VARCHAR(40),
    id SERIAL PRIMARY KEY
);

