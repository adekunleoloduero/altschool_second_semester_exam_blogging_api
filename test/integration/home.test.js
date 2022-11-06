const app = require('../../app');
const supertest = require('supertest');



describe('GET /', () => {
    it('Returns the homepage', async() => {
        const response = await supertest(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, welcome to my Blogging API. This API allow users to create or read articles created by others. Please Go to /api/articles to get a list of published articles or checkout the README.md file in the GitHub Repository to learn more about how it works and how to run or test it. Thank you!");
    });
})