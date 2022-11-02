const request = require('supertest')
const UserModel = require('../../src/models/article.model')
const app = require('../../index');
const { connect } = require('./db');




describe("Protected articles route", () => {

    let conn;

    const testUser = {
        "firstName": "Jon",
        "lastName": "Doe",
        "email": "jondoe@gmail.com",
        "password": "jon123"
    };

    const testArticle = {
        "title": 'Learning about Node.Js Core Modules',
        "description": "This article will introduce you to some of the core modules in Node.js. These include; file System (fs), Operating System (os), http and path modules.",
        "body": 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc arcu ipsum, mattis non sem at, iaculis porttitor tellus. Proin ut nisl malesuada, consectetur nibh ac, tristique nisi. Pellentesque non urna eget diam tempus ultrices vestibulum eu ligula. Vestibulum tempus augue libero, eget tincidunt est iaculis nec. Morbi accumsan ligula nec luctus facilisis. Fusce risus odio, mollis eget urna eget, tempus venenatis orci. Donec est velit, cursus eget mi quis, suscipit laoreet tellus. Nulla tincidunt ac turpis sit amet interdum. In auctor purus sapien, quis rhoncus nisl aliquam non. Mauris eu elementum magna, at varius dolor. Aenean euismod sit amet risus vitae euismod. Donec mattis convallis diam a pulvinar. Donec pulvinar mollis tempus. Cras erat sem, ultrices a erat vel, fermentum aliquam dolor.',
        "tags": ["Node.Js", "Javascript", "Modules", ""]
    }

    let accessToken;

    beforeAll(async () => {
        conn = await connect()


        // Signup a test user
        await request(app).post('/api/signup').send(testUser);

        //Signin the test user to obtain a jwt access token
        const response = await request(app).post('/api/signin').send({
            "email": testUser.email,
            "password": testUser.password
        });
        accessToken = response.body.token;
    })


    afterEach(async () => {
        await conn.cleanup()
    })

    afterAll(async () => {
        await conn.disconnect()
    })



    it('POST /api/articles - Creates a new article in draft state and saves it to the database', async() => {
        //Article details
        const body = {
            
        };

        const response = await request(app).post('/api/articles').send(testArticle).set("Authorization", `Bearer ${accessToken}`);
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

    it('POST /api/articles - Denies not logged in user access to create an article', async() => {
        const response = await request(app).post('/api/articles').send(testArticle); //Authorization deliberately omitted
        expect(response.status).toBe(401);
        expect(response.text).toBe("Unauthorized");
    });
});