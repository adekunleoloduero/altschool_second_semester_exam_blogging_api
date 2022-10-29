const request = require('supertest')
const UserModel = require('../../src/models/user.model')
const app = require('../../index');
const { connect } = require('./db');



describe('POST /signup and POST /signin', () => {
    let conn;

    const testUserInfo = {
        "firstName": "Jon",
        "lastName": "Doe",
        "email": "jondoe@gmail.com",
        "password": "jon123"
    };

    
    beforeAll(async () => {
        conn = await connect()
    })

    beforeEach(async () => {
        //Save a test user to the DB
        await UserModel.create(testUserInfo);
        //
    })

    afterEach(async () => {
        await conn.cleanup()
    })

    afterAll(async () => {
        await conn.disconnect()
    })


    it("Should signup a user and save the user's information to the database", async() => {
        const userInfo = {
            "firstName": "Jane",
            "lastName": "Doe",
            "email": "janedoe@gmail.com",
            "password": "jane123"
        };
        const response = await request(app).post('/signup').send(userInfo);
        expect(response.status).toBe(201);
        expect(response.body.info).toEqual({ message: "Signup was successful." });
        expect(response.body.user).toHaveProperty('firstName');
        expect(response.body.user).toHaveProperty('lastName');
        expect(response.body.user).toHaveProperty('email');
        expect(response.body.user).toHaveProperty('createdAt');
        expect(response.body.user).toHaveProperty('updatedAt');
    })

    it("Returns the expected message if a user with the email provided already exists", async() => {
        const userInfo = {
            "firstName": "Arya",
            "lastName": "Stark",
            "email": testUserInfo.email,
            "password": "arya123"
        };
        const response = await request(app).post('/signup').send(userInfo);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "A user with this email already exists." });
    })

    it("Should sign a user in and return a JWT token", async() => {
        //Signin as testUser with valid email and password
        const userCredentials = {
            "email": testUserInfo.email,
            "password": testUserInfo.password
        }

        const response = await request(app).post('/signin').send(userCredentials);
        expect(response.status).toBe(200);
        expect(response.body.info).toEqual({ message: `Welcome back ${testUserInfo.firstName}.`});
        expect(response.body).toHaveProperty("token");
    });

    it("Returns the expected message if the user provides an invalid email", async() => {
        //Attempt signing as testUser but with an invalid email
        const userCredentials = {
            "email": "invalidEmail",
            "password": testUserInfo.password
        }
        
        const response = await request(app).post('/signin').send(userCredentials);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "User not found." });
    });

    it("Returns the expected message if the user provides an invalid password", async() => {
        //Attempt signing as testUser but with an invalid password
        const userCredentials = {
            "email": testUserInfo.email,
            "password": "InvalidPassword"
        }
        
        const response = await request(app).post('/signin').send(userCredentials);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Password is incorrect." });
    });
    
})