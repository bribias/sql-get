require('dotenv').config();

const { execSync } = require('child_process');
// const { exception } = require('console');

const fakeRequest = require('supertest');

const app = require('../lib/app');
const client = require('../lib/client');

const characters = [
  {
    'id': 1,
    'name': 'Dean Winchester',
    'cool_factor': 10,
    'category_id': 1,
    'owner_id': 1,
    'category': 'hero'
  },
  {
    'id': 1,
    'name': 'Sam Winchester',
    'cool_factor': 6,
    'category_id': 1,
    'owner_id': 1,
    'category': 'hero'
  },
  {
    'id': 2,
    'name': 'Klaus Mikaelson',
    'cool_factor': 10,
    'category_id': 2,
    'owner_id': 1,
    'category': 'villian'
  },
  {
    'id': 2,
    'name': 'Damon Salvetore',
    'cool_factor': 8,
    'category_id': 2,
    'owner_id': 1,
    'category': 'villian'
  },
  {
    'id': 2,
    'name': 'Rebeka Mikaelson',
    'cool_factor': 9,
    'category_id': 2,
    'owner_id': 1,
    'category': 'villian'
  },
  {
    'id': 1,
    'name': 'Stefan Salvetore',
    'cool_factor': 1,
    'category_id': 1,
    'owner_id': 1,
    'category': 'hero'
  },
  {
    'id': 1,
    'name': 'Buffy Summers',
    'cool_factor': 20,
    'category_id': 1,
    'owner_id': 1,
    'category': 'hero'
  },
  {
    'id': 1,
    'name': 'Angel',
    'cool_factor': 2,
    'category_id': 1,
    'owner_id': 1,
    'category': 'hero'
  },
  {
    'id': 2,
    'name': 'Spike',
    'cool_factor': 10,
    'category_id': 2,
    'owner_id': 1,
    'category': 'villian'
  }
];

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

    test('/GET all characters', async () => {
      const expectation = characters;
      const data = await fakeRequest(app)
        .get('/characters')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
