const request = require('supertest')
const app = require('../../app.js')

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    })
})

describe('Test POST /launch', () => {
    const completeLaunchDate = {
        mission: 'Uss Enterprise',
        rocket: 'NCC 12-D',
        target: 'Kepler-186 f',
        launchDate: 'January 4, 2028'
    }

    const launchDataWithoutDate = {
        mission: 'Uss Enterprise',
        rocket: 'NCC 12-D',
        target: 'Kepler-186 f',
    }

    test('It should respond with 201 created', async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchDate)
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchDate.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate)

        expect(response.body).toMatchObject(launchDataWithoutDate)   

    });

    test('It should catch missing required properties', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch property'
        })
    });

    test('It should catch invalid dates', async () => {
        const response = await request(app)
            .post('/launches')
            .send(Object.assign(launchDataWithoutDate, {launchDate: 'bad date'}))
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Invalid launch date'
        })
    })
})