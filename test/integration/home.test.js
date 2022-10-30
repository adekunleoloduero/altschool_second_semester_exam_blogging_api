const app = require('../../index');
const supertest = require('supertest');



describe('GET /', () => {
    it('Returns the homepage', async() => {
        const response = await supertest(app).get('/');
        expect(response.status).toBe(302);
    });
})