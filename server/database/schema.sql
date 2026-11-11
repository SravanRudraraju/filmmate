CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_image TEXT
)

ALTER TABLE users
ADD COLUMN name VARCHAR(100),
ADD COLUMN bio TEXT,
ADD COLUMN location VARCHAR(100),
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP


ALTER TABLE users
ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN verification_token_hash VARCHAR(64),
ADD COLUMN verification_token_expires_at TIMESTAMP;



CREATE TABLE watchlist(
    user_id INTEGER NOT NULL,
    tmdb_movie_id INTEGER NOT NULL,

    PRIMARY KEY (user_id , tmdb_movie_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE liked_movies(
    user_id INTEGER NOT NULL,
    tmdb_movie_id INTEGER NOT NULL,

    PRIMARY KEY (user_id , tmdb_movie_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
ALTER TABLE liked_movies
ADD COLUMN liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;



CREATE TABLE watched_movies(
    user_id INTEGER NOT NULL,
    tmdb_movie_id INTEGER NOT NULL,

    PRIMARY KEY (user_id , tmdb_movie_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE ratings (
	user_id INTEGER NOT NULL,
	tmdb_movie_id INTEGER NOT NULL,
	rating NUMERIC(2,1) NOT NULL CHECK(rating>=0.5 AND rating <=5.0),
	PRIMARY KEY (user_id , tmdb_movie_id),
	FOREIGN KEY (user_id)
	REFERENCES users(id)
	ON DELETE CASCADE
)

CREATE TABLE diary_entries (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	tmdb_movie_id INTEGER NOT NULL,
	watched_on DATE NOT NULL DEFAULT CURRENT_DATE,
	review TEXT,
	rating NUMERIC(2,1),
	liked BOOLEAN DEFAULT FALSE,
	FOREIGN KEY (user_id)
	REFERENCES users(id)
	ON DELETE CASCADE,
	CHECK (rating >=0.5 AND rating <=5.0)
)

CREATE TABLE movies (
    tmdb_movie_id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    poster_path TEXT,
    release_date DATE
);


CREATE TABLE user_favourite_movies (
    user_id INTEGER NOT NULL,
    tmdb_movie_id INTEGER NOT NULL,
    position INTEGER NOT NULL CHECK (position >= 1 AND position <= 5),
    PRIMARY KEY (user_id, position),
    UNIQUE (user_id, tmdb_movie_id),
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);