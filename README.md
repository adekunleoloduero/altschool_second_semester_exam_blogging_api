# Blogging API
Blogging API has a general endpoint that shows a list of articles that have been created by different people, and anybody that calls this endpoint, should be able to read an article created by them or other users. Users can signup for, as well as signin into the blog. It also has other endpoints which are protected and requires authentication to gain access.

---

## Features
1. A user should be able to sign up and sign in using Passport and JWT Strategy.
2. Logged in and not logged in users are able to get a list of published articles.
   - The list of articles is paginated.
   - The default number of article per page is 20. 
   - Articles are searchable by author, title and tags.
   - Articles are also orderable by readCount, readingTime and timestamp
3. Logged in and not logged in users are able to read a published article by getting it by it's ID. 
   - The author information is returned with the request article. 
   - The readCount of the article is incremented by 1.  
4. Logged in users are able create a an article.
   - Each article created would have the following properties title, description, tags, author, timestamp, state, readCount, readingTime, body and _id.
   - A newly created article has a defualt state of draft.
5. If signed in, the "author" of a given article is able to update the state of the article to published.
6. If signed in, the "author" of a given article is able to edit the article in draft or published state.
7. If signed in, the "author" of a given article is able to delete the article in draft or published state.
8. If signed in, a user is able to get a list of their own articles which are in published state.
   - The list of articles is paginated and default number of page is 20 articles per page.
   - THe list is filterable by state.
 
---
## Setup
- Install NodeJS, mongodb
- pull this repo
- update env with example.env
- run `npm run start:dev`

---
## Base URL
- somehostsite.com


## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  firstName | String  |  required | 
|  lastName  | String |  required |
|  email     | String  |  required |
|  password  | String |  required |



### Article
| field  |  data_type | constraints  |
|---|---|---|
|  id |  String |  required |
|  title |  String |  required |
|  description | String  |  required |
|  tags  |  Array |  required  |
|  author     | String  |  required |
|  timestamp |   Date |  required  |
|  state |  String |  required, enum: ['draft', 'published'], default: 'draft' |
|  readCount |  Number |  default: 0 |
|  readingTime |  Number |  required |
|  body |  String |  required |


## APIs


### Home
```
- Route: /
- Method: GET

```
- Response
Success
```
Hello, welcome to my Blogging API. This API allow users to create articles or read articles created by others.Please go to /README.md to learn more about how it works and how to run or test it.
Thank you!

```
---
### Get list of published articles

- Route: /api/articles
- Method: GET
- Query Params (Optional): 
  - author: author_email,
  - title: article_title,
  - tags: tag1,tag2,tag3,
  - readCount: asc/desc,
  - readingTime: asc/desc,
  - timestamp: asc/desc

- Responses

Success
```
[
    "article": {
        "title": "Example Article",
        "description": "An example aticle by Jane Doe",
        "state": "draft",
        "body": "This is an example article written by Jane Doe.",
        "readCount": 0,
        "tags": [
            "node.js",
            "javascript",
            "express.js"
        ],
        "timestamp": "2022-11-06T00:01:25.847Z",
        "_id": "6366f9ee91ddd02296a21294",
        "author": "janedoe@gmail.com",
        "readingTime": 1
    },
    ...
]

```
---

### Read a published article

- Route: /api/articles/read/:id
- Method: GET

- Responses

Success
```
{
    "author": {
        "_id": "636669e46a42c8dd47741a80",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "janedoe@gmail.com",
        "createdAt": "2022-11-05T13:45:54.220Z",
        "__v": 0
    },
    "article": {
        "_id": "6367515346fa1371f2fb6812",
        "title": "Example Article 3",
        "description": "An example aticle by Jane Doe",
        "state": "published",
        "body": "This is an example article 3 written by Jane Doe.",
        "readCount": 1,
        "tags": [
            "python",
            "django",
            "flask"
        ],
        "timestamp": "2022-11-06T06:15:49.257Z",
        "author": "janedoe@gmail.com",
        "readingTime": 1,
        "__v": 0
    }
}
```

---

### Signup User

- Route: /signup
- Method: POST
- Body: 
```
{
  "firstName": "Jane",
  "lastName": "Doe"
  "email": "janedoe@gmail.com",
  "password": "jane123",
}
```

- Responses

Success
```
{
    info: {message: "Signup was successful."},
    user: {
        "email": "janedoe@example.com",
        "firstName": "Jane",
        "lastName": "Doe",
        "createdAt": "2022-11-05T23:32:46.440Z",
        "_id": "6367f3c2af0418bb3a4e12c1",
    }
}
```
---
### Signin

- Route: /signin
- Method: POST
- Body: 
```
{
  "email": "janedoe@gmail.com",
  "password": "jane123"
}
```

- Responses

Success
```
{
    "info": {
        "message": "Welcome back Jane."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzNjZmM2MyYWYwZjE4YmIzYTRlOTliMSIsImVtYWlsIjoiam9uZWRvZUBnbWFpbC5jb20ifSwiaWF0IjoxNjY3NjkxOTc1LCJleHAiOjE2Njc2OTU1NzV9.YYkTE4ojQqRr2a-o7eYODx5IYUKJ_tt988NQi5zAotY"
}
```

---
### Create Article

- Route: /api/articles/create
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
    "title": "Example Article",
    "description": "An example aticle by Jane Doe",
    "body": "This is an example article written by Jane Doe.",
    "tags": [
        "node.js",
        "javascript",
        "express.js"
    ]
}

```

- Responses

Success
```
{
    "message": "New draft article created.",
    "article": {
        "title": "Example Article",
        "description": "An example aticle by Jane Doe",
        "state": "draft",
        "body": "This is an example article written by Jane Doe.",
        "readCount": 0,
        "tags": [
            "node.js",
            "javascript",
            "express.js"
        ],
        "timestamp": "2022-11-06T00:01:25.847Z",
        "_id": "6366f9ee91ddd02296a21294",
        "author": "janedoe@gmail.com",
        "readingTime": 1
    }
}

```
---
### Publish Article

- Route: /api/articles/publish/:articleId
- Method: PATCH
- Header
    - Authorization: Bearer {token}
- Responses

Success
```
{
    "message": "Congratulations, your article was successfully published.",
    "article": {
        "_id": "6366f9ee91ddd02296a21294",
        "title": "Example Article",
        "description": "An example aticle by Jane Doe",
        "state": "published",
        "body": "This is an example article 3 written by Jane Doe.",
        "readCount": 0,
        "tags": [
            "node.js",
            "javascript",
            "express.js"
        ],
        "timestamp": "2022-11-06T06:15:49.257Z",
        "author": "janedoe@gmail.com",
        "readingTime": 1,
        "__v": 0
    }
}
```
---

### Get Orders

- Route: /orders
- Method: GET
- Header:
    - Authorization: Bearer {token}
- Query params: 
    - page (default: 1)
    - per_page (default: 10)
    - order_by (default: created_at)
    - order (options: asc | desc, default: desc)
    - state
    - created_at
- Responses

Success
```
{
    state: 1,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
```
---

...

## Contributor
- Tajudeen Sheriff Adekunle