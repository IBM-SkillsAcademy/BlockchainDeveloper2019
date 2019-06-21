const chai = require('chai');
const supertest = require('supertest');

chai.should();
const STAGING_HOST_NAME = process.env.STAGING_HOST_NAME || 'http://localhost:3000';
const api = supertest(STAGING_HOST_NAME);

describe('Enrollment and Registration: ', () => {
  describe('GET /api/v1/auth/enroll-admin', () => {
    it('Admin should be enrolled succesfully', (done) => {
      api.get('/api/v1/auth/enroll-admin')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          if (res.error) {
            res.error.status.should.equal(409);
            console.log('\twith expected 409 conflict error');
          }
          return done();
        });
    });
  });

  describe('GET /api/v1/auth/enroll-user', () => {
    it('User should be registered succesfully', (done) => {
      api.get('/api/v1/auth/enroll-user')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          if (res.error) {
            res.error.status.should.equal(409);
            console.log('\twith expected 409 conflict error');
          }
          return done();
        });
    });
  });
});
