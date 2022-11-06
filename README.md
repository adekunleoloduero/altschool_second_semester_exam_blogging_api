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
   - The author information is returned with the requested article. 
   - The readCount of the article is incremented by 1.  
4. Logged in users are able create a an article.
   - Each article created would have the following properties; title, description, tags, author, timestamp, state, readCount, readingTime, body and _id.
   - A newly created article has a default state of draft.
5. If signed in, the "author" of a given article is able to update the state of the article to published.
6. If signed in, the "author" of a given article is able to edit the article in draft or published state.
7. If signed in, the "author" of a given article is able to delete the article in draft or published state.
8. If signed in, a user is able to get a list of their own articles.
   - The list of articles is paginated and the default is 20 articles per page.
   - THe list is also filterable by state.
 
---

## Base URL
- https://byzantium-octopus-tux.cyclic.app/
---

## How to Run/Test
- Copy and paste the Base URL into a Postman Client or anyother API testing platform of your choice.
- Add the required path, e.g /api/articles.
- Select the appropriate METHOD, e.g GET.
- Set any additional data like Authoriztion or query params.
- Clink send to get a response.
---

## Models

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  String |  default: ObjectId |
|  firstName | String  |  required | 
|  lastName  | String |  required |
|  email     | String  |  required, unique, lowercase |
|  password  | String |  required |
|  createAt  | Date |  default: Date.now() |


### Article
| field  |  data_type | constraints  |
|---|---|---|
|  id |  String |  default: ObjecId |
|  title |  String |  required |
|  description | String  |  required |
|  tags  |  Array |  required  |
|  author     | String  |  required |
|  timestamp |   Date |  defautl: Date.now()  |
|  state |  String |  required, enum: ['draft', 'published'], default: 'draft' |
|  readCount |  Number |  default: 0 |
|  readingTime |  Number |  required |
|  body |  String |  required |

---

## APIs


### Home
```
- Route: /
- Method: GET
```
- Response:

Success
```
Hello, welcome to my Blogging API. This API allow users to create or read articles created by others. Please Go to /api/articles to get a list of published articles or checkout the README.md file in the GitHub Repository to learn more about how it works and how to run or test it.
Thank you!

```
---

### Signup User

- Route: /api/signup
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
- Responses:

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

- Route: /api/signin
- Method: POST
- Body: 
```
{
  "email": "janedoe@gmail.com",
  "password": "jane123"
}
```
- Responses:

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
### Get list of published articles

- Route: /api/articles
- Method: GET
- Query Params: 
  - author: author_email,
  - title: article_title,
  - tags: tag1,tag2,tag3,
  - readCount: asc/desc,
  - readingTime: asc/desc,
  - timestamp: asc/desc
- Responses:

Success
```
[
    "articles": {
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
- Responses:

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
- Responses:

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
- Responses:

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
### Edit Article

- Route: /api/articles/edit/:articleId
- Method: PATCH
- Header
    - Authorization: Bearer {token}
- Body:
```
{
    "title": "Updated example article",
    "description" This is the updated example article by Jane Doe"
}

```
- Responses:

Success
```
{
    "message": "Your changes have been saved.",
    "article": {
        "_id": "6367515346fa1371f2fb6812",
        "title": "Updated example article",
        "description": "This is the updated example article by Jane Doe",
        "state": "published",
        "body": "This is an example article written by Jane Doe.",
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
### Delete Article

- Route: /api/articles/delete/:articleId
- Method: DELETE
- Header
    - Authorization: Bearer {token}
- Responses:

Success
```
{
    "message": "Deleted one (1) article."
}
```

---
### Get a list of own articles

- Route: /api/articles/my-articles
- Method: GET
- Query Params:
  - state: draft / published
- Header
    - Authorization: Bearer {token}
- Responses:

Success
```
[
    "articles": {
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

## Contributor (s)
- Tajudeen Sheriff Adekunle