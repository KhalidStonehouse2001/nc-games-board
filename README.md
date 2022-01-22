# Khalids House of Games API

## Project Background

---

House Of Games is my first API (Application-Programming-Interface) i have created during my time at Northcoders, and its purpose is to supply information on games with reviews, categories, comments and users.

As the games data was provided by Northcoders, these are the steps i followed to make this API:

- PostgreSql & JavaScript: Creating and seeding the databases and connection to them.
- MVC pattern
- TDD: Using jest and supertest to test the applications functions thoroughly.
- Error handling and handling incoming requests
- Hosting Application with Heruko

## Try Out My API!

---

You can access my API [HERE](https://khalids-games-board.herokuapp.com/api)

## Requirements

- Node minimum v12, recommended v17.0.1.
- PostgreSQL v14.1

## Steps

```git
1 - clone this repository - https://github.com/KhalidStonehouse2001/be-nc-games.git

2 - run "npm i" in the terminal to install the required dependencies

3 - create these 2 files in the repository:

[file name = '.env.test' && file contents = PGDATABASE=nc_games],

[file name = '.env.development' && file contents = PGDATABASE=nc_games_test]
```

## Setup to run tests

---

```
1 - npm setup-dbs
    (sets up databases)

2 - npm run seed
    (seeds database and populates tables)

3 - npm run test app
    (checks if endpoints are working)
```

## Available Endpoints

---

```https
GET /api
GET /api/categories
GET /api/comments
GET /api/comments/:comment_id
DELETE /api/comments/:comment_id
GET /api/reviews
GET /api/reviews/:review_id
PATCH /api/reviews/:review_id
GET /api/reviews/:review_id/comments
POST /api/reviews/:review_id/comments
GET /api/users
GET /api/users/:username
```

---

#### **GET /api**

Responds with:

JSON describing all the available endpoints on your API

---

#### **GET /api/categories**

Responds with:

An array of category objects, each of which should have the following properties:

- slug
- description

---

#### **GET /api/reviews**

Responds with:

an reviews array of review objects, each of which should have the following properties:

- owner which is the username from the users table
- title
- review_id
- category
- review_img_url
- created_at
- votes
- comment_count which is the total count of all the comments with this review_id

---
