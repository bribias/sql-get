require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const characters = require('../data/characters');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns characters', async() => {

      const expectation = [
        {
          'id': 1,
          'name': 'Dean Winchester',
          'cool_factor': 10,
        },
        {
          'id': 2,
          'name': 'Sam Winchester',
          'cool_factor': 6,
        },
        {
          'id': 3,
          'name': 'Klaus Mikaelson',
          'cool_factor': 10,
        }
      ];

      const data = await fakeRequest(app)
        .get('/characters')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
