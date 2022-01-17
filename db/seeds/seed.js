const format = require('pg-format');
const db = require('../connection');
const seed = (data) => {
	const { categoryData, commentData, reviewData, userData } = data;
	// 1. create tables
	return db.query(`DROP TABLE IF EXISTS comments`).then(() => {
		return db.query(`DROP TABLE IF EXISTS reviews`).then(() => {
			return (
				db
					.query('DROP TABLE IF EXISTS users')
					.then(() => {
						return db.query('DROP TABLE IF EXISTS categories');
					})
					.then(() => {
						return db.query(`CREATE TABLE categories
            (slug VARCHAR(200) NOT NULL PRIMARY KEY,
             description TEXT NOT NULL)`);
					})
					.then(() => {
						return db.query(`CREATE TABLE users
          (username VARCHAR(200) NOT NULL PRIMARY KEY,
          avatar_url TEXT NOT NULL,
          name VARCHAR(200) NOT NULL)`);
					})
					.then(() => {
						return db.query(`CREATE TABLE reviews
          (review_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          review_body TEXT NOT NULL,
          designer TEXT NOT NULL,
          review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          votes INT DEFAULT 0,
          category VARCHAR(200) REFERENCES categories(slug),
          owner VARCHAR(200) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
          created_at TIMESTAMP)`);
					})
					.then(() => {
						return db.query(`CREATE TABLE comments
          (comment_id SERIAL PRIMARY KEY,
          author VARCHAR(200) REFERENCES users(username) ON DELETE CASCADE,
          review_id INT REFERENCES reviews(review_id),
          votes INT DEFAULT 0,
          created_at TIMESTAMP,
          body TEXT NOT NULL)`);
					})
					// 2. insert data
					.then(() => {
						const queryStr = format(
							`INSERT INTO categories
          (slug, description)
          VALUES 
          %L
          RETURNING *;`,
							categoryData.map((category) => [
								category.slug,
								category.description,
							])
						);
						return db.query(queryStr);
					})
					.then((res) => {
						const queryStr = format(
							`INSERT INTO users 
          (username, avatar_url, name)
          VALUES %L RETURNING *;`,
							userData.map((user) => [
								user.username,
								user.avatar_url,
								user.name,
							])
						);
						return db.query(queryStr);
					})
					.then((res) => {
						const queryStr = format(
							`INSERT INTO reviews
            (title, designer, owner, review_img_url, review_body, created_at, category, votes)
            VALUES 
            %L
            RETURNING *`,
							reviewData.map((review) => [
								review.title,
								review.designer,
								review.owner,
								review.review_img_url,
								review.review_body,
								review.created_at,
								review.category,
								review.votes,
							])
						);
						return db.query(queryStr);
					})
					.then((res) => {
						const queryStr = format(
							`INSERT INTO comments 
            (body, author, review_id, votes, created_at)
            VALUES
            %L
            RETURNING *;`,
							commentData.map((comment) => [
								comment.body,
								comment.author,
								comment.review_id,
								comment.votes,
								comment.created_at,
							])
						);
						return db.query(queryStr);
					})
					.then((res) => {
						console.log(res.rows);
					})
			);
		});
	});
};

module.exports = seed;
