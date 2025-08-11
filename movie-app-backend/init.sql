-- Create the search analytics table (replaces your Appwrite collection)
CREATE TABLE search_analytics (
                                  id BIGSERIAL PRIMARY KEY,
                                  search_term VARCHAR(255) NOT NULL,
                                  movie_id BIGINT,
                                  title VARCHAR(500),
                                  poster_url VARCHAR(500),
                                  count INTEGER DEFAULT 1,
                                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create unique constraint for search_term + movie_id combination
CREATE UNIQUE INDEX idx_search_analytics_unique ON search_analytics(search_term, COALESCE(movie_id, 0));

-- Create index for performance
CREATE INDEX idx_search_analytics_count ON search_analytics(count DESC);
CREATE INDEX idx_search_analytics_term ON search_analytics(search_term);

-- Users table for future authentication
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       username VARCHAR(100) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User favorites table
CREATE TABLE user_favorites (
                                id BIGSERIAL PRIMARY KEY,
                                user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                movie_id BIGINT NOT NULL,
                                movie_title VARCHAR(500) NOT NULL,
                                poster_url VARCHAR(500),
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                UNIQUE(user_id, movie_id)
);

-- User movie history table
CREATE TABLE user_movie_history (
                                    id BIGSERIAL PRIMARY KEY,
                                    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                                    movie_id BIGINT NOT NULL,
                                    movie_title VARCHAR(500) NOT NULL,
                                    poster_url VARCHAR(500),
                                    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);