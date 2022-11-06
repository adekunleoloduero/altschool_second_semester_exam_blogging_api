const request = require('supertest')
const UserModel = require('../../src/models/article.model')
const app = require('../../app');
const { connect } = require('./db');




describe("Protected articles route", () => {

    let conn;

    const testUser1 = {
        "firstName": "Jon",
        "lastName": "Doe",
        "email": "jondoe@gmail.com",
        "password": "jon123"
    };

    const testArticle1 = {
        "title": 'Introduction to Node.Js Core Modules',
        "description": "This article will introduce you to some of the core modules in Node.js. These include; file System (fs), Operating System (os), http and path modules.",
        "body": 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc arcu ipsum, mattis non sem at, iaculis porttitor tellus. Proin ut nisl malesuada, consectetur nibh ac, tristique nisi. Pellentesque non urna eget diam tempus ultrices vestibulum eu ligula. Vestibulum tempus augue libero, eget tincidunt est iaculis nec. Morbi accumsan ligula nec luctus facilisis. Fusce risus odio, mollis eget urna eget, tempus venenatis orci. Donec est velit, cursus eget mi quis, suscipit laoreet tellus. Nulla tincidunt ac turpis sit amet interdum. In auctor purus sapien, quis rhoncus nisl aliquam non. Mauris eu elementum magna, at varius dolor. Aenean euismod sit amet risus vitae euismod. Donec mattis convallis diam a pulvinar. Donec pulvinar mollis tempus. Cras erat sem, ultrices a erat vel, fermentum aliquam dolor.',
        "tags": ["Node.Js", "Javascript", "Modules"]
    }

    const testUser2 = {
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "janedoe@gmail.com",
        "password": "jane123"
    }

    const testArticle2 = {
        "title": 'How to get started with buidling APIs with with Express.js',
        "description": "In this article we'll learn how to build a simple Node.js API with express.js framework. Rather than usin the built-in http module in node.js.",
        "body": 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc arcu ipsum, mattis non sem at, iaculis porttitor tellus. Proin ut nisl malesuada, consectetur nibh ac, tristique nisi. Pellentesque non urna eget diam tempus ultrices vestibulum eu ligula. Vestibulum tempus augue libero, eget tincidunt est iaculis nec. Morbi accumsan ligula nec luctus facilisis. Fusce risus odio, mollis eget urna eget, tempus venenatis orci. Donec est velit, cursus eget mi quis, suscipit laoreet tellus. Nulla tincidunt ac turpis sit amet interdum. In auctor purus sapien, quis rhoncus nisl aliquam non. Mauris eu elementum magna, at varius dolor. Aenean euismod sit amet risus vitae euismod. Donec mattis convallis diam a pulvinar. Donec pulvinar mollis tempus. Cras erat sem, ultrices a erat vel, fermentum aliquam dolor.',
        "tags": ["Node.js", "Javascript", "Express.js", "API"]
    }

    let testArticle1ID;
    let testArticle2ID;
    let accessToken1; //Will be used to access protected routes by testUser1
    let accessToken2; //Will be used to access protected routes by testUser2
    let testArticle1ReadCount;

    beforeAll(async () => {
        conn = await connect()
        
    })

    beforeEach(async () => {
        // Signup and signin test user 1
        let response = await request(app).post('/api/signup').send(testUser1);
        
        response = await request(app).post('/api/signin').send({
            "email": testUser1.email,
            "password": testUser1.password
        });
        accessToken1 = response.body.token;
        //Create test article 1 and get it's ID
        response = await request(app).post('/api/articles/create').send(testArticle1).set('Authorization', `Bearer ${accessToken1}`);
        testArticle1ID = response.body.article['_id'];
        testArticle1ReadCount = response.body.article.readCount;
        
        
        //Signup and signin test user 2
        response = await request(app).post('/api/signup').send(testUser2);
        
        response = await request(app).post('/api/signin').send({
            "email": testUser2.email,
            "password": testUser2.password
        });
        accessToken2 = response.body.token; 
        //Create test article 2 and get it's ID
        response = await request(app).post('/api/articles/create').send(testArticle2).set('Authorization', `Bearer ${accessToken2}`);
        testArticle2ID = response.body.article['_id'];
    });

    afterEach(async () => {
        await conn.cleanup()
    })

    afterAll(async () => {
        await conn.disconnect()
    })



    it('POST /api/articles - Creates a new article in draft state and saves it to the database', async() => {
        
        const response = await request(app).post('/api/articles/create').send(testArticle1).set("Authorization", `Bearer ${accessToken1}`);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("New draft article created.");
        expect(response.body.article).toHaveProperty("_id");
        expect(response.body.article).toHaveProperty("title");
        expect(response.body.article).toHaveProperty("description");
        expect(response.body.article).toHaveProperty("body");
        expect(response.body.article).toHaveProperty("tags");
        expect(response.body.article).toHaveProperty("readingTime");
        expect(response.body.article).toHaveProperty("author");
        expect(response.body.article).toHaveProperty("timestamp");
        expect(response.body.article.state).toBe("draft");
        expect(response.body.article.readCount).toBe(0);
    });

    it('POST /api/articles/create - Denies not logged in user access to create an article', async() => {
        const response = await request(app).post('/api/articles/create').send(testArticle1); //Authorization deliberately omitted
        expect(response.status).toBe(401);
        expect(response.text).toBe("Unauthorized");
    });

    
    it('GET /api/articles - Get a list of published articles of not more than 20 per page.', async() => {
        const queryParams = {
            "author": "janedoe@gmail.com",
        }
        const response = await request(app).get('/api/articles').query(queryParams);
        expect(response.status).toBe(200);
        //Number of articles per page should not exceed 20
        let articles = response.body;
        expect(articles.length).toBeLessThanOrEqual(20);
        
        //Only articles belonging the given author should be returned
        let searchedByAuthor = true;
        for (const aticle of response.body) {
            if (article.author != queryParams.author) {
                searchedByAuthor = false; //return false if at least 1 article has an author that was not specified
            }
            return searchedByAuthor;
        }
        expect(searchedByAuthor).toBe(true); //Assert that all articles belong the specified author
    });
    

    // it('GET /api/articles/read/:articleId - returns article with specified ID and increment readCount by 1', async() => {
    //     //Get current read count
    //     const prevReadCount = testArticle1ReadCount;
        
    //     //Request the article again
    //     response = await request(app).get(`/api/articles/read/${testArticle1ID}`);
    //     expect(response.status).toBe(200);
    //     expect(response.body.article.readCount).toBe(prevReadCount + 1); //readCount should have increased by 1
    //     expect(response.body).toHaveProperty("author"); //Assert tha author info is returned with the article
    // });
    

    it("PATCH /api/articles/publish/:articleId - allows only an article's author to update it' state to published", async() => {
        const response = await request(app).patch(`/api/articles/publish/${testArticle1ID}`).set("Authorization", `Bearer ${accessToken1}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Congratulations, your article was successfully published.');
        expect(response.body.article.state).toBe("published");
    })

    it("PATCH /api/articles/edit/:articleId - allows only an article's author to edit it", async() => {
        const body = {
            "title": "Updated test article 1",
            "state": "published"
        }
        const response = await request(app).patch(`/api/articles/edit/${testArticle1ID}`).send(body).set("Authorization", `Bearer ${accessToken1}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Your changes have been saved.');
        expect(response.body.article.state).toBe("published");
    })

    it("DELETE /api/articles/delete/:articleId - allows only an article's author to permanently delete it", async() => {
        const response = await request(app).delete(`/api/articles/delete/${testArticle1ID}`).set("Authorization", `Bearer ${accessToken1}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({message: 'Deleted one (1) article.' });
    })


    it('GET /api/articles/my-articles - returns a list of articles written by logged in user', async() => {
        const queryParams = {
            "state": "published"
        }
        const response = await request(app).get('/api/articles/my-articles').query(queryParams).set("Authorization", `Bearer ${accessToken1}`);
        expect(response.status).toBe(200);
        //Number of articles per page should not exceed 20
        let articles = response.body;
        expect(articles.length).toBeLessThanOrEqual(20);
        
        //Only articles with specifed state should be returned
        let searchedByState = true;
        for (const aticle of response.body) {
            if (article.state != queryParams.state) {
                searchedByState = false; //return false if at least 1 article has a different state
            }
            return searchedByState;
        }
        expect(searchedByState).toBe(true); //Assert that all articles belong the specified author
        
    });
});