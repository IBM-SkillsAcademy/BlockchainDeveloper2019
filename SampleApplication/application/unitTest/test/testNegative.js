const chai = require('chai');
const supertest = require('supertest');
const shortid = require('shortid');

chai.should();
const apiManufacturer = supertest('http://localhost:6001');
const apiRegulator = supertest('http://localhost:6002');
const apiInsurer = supertest('http://localhost:6003');

const mochaAsync = (fn) => {
  return done => {
    fn.call().then(done, err => {
      done(err);
    });
  };
};

beforeEach((done) => {
  setTimeout(() => done(), 1000)
});

describe('Negative Test for Enrollment and Registration: ', () => {
    describe('GET /api/v1/auth/enroll-admin', () => {
      it('Cannot enroll an admin if an admin identity already exists in Manufacturer org', mochaAsync(async () => {
        const res = await apiManufacturer
          .get('/api/v1/auth/enroll-admin')
          .set('Content-Type', 'application/json')
          .expect(409);
        res.body.message.should.include('An identity for the admin user "admin" already exists in the wallet');
      }));

      it('Cannot enroll an admin if an admin identity already exists in Regulator org', mochaAsync(async () => {
        const res = await apiRegulator
          .get('/api/v1/auth/enroll-admin')
          .set('Content-Type', 'application/json')
          .expect(409);
        res.body.message.should.include('An identity for the admin user "admin" already exists in the wallet');
      }));

      it('Cannot enroll an admin if an admin identity already exists in Insurer org', mochaAsync(async () => {
        const res = await apiInsurer
          .get('/api/v1/auth/enroll-admin')
          .set('Content-Type', 'application/json')
          .expect(409);
        res.body.message.should.include('An identity for the admin user "admin" already exists in the wallet');
      }));
    });
  
    // describe('POST /api/v1/auth/register-user', () => {
    //   it('User should be registered succesfully', mochaAsync(async () => {
    //     const res = await apiManufacturer
    //       .post('/api/v1/auth/register-user')
    //       .set('Content-Type', 'application/json')
    //       .send({
    //         enrollmentID: 'user1'
    //       })
    //     if (res.error) {
    //       res.error.status.should.equal(409);
    //       console.log('\twith expected 409 conflict error');
    //     }
    //   }));
    // });
  
    // describe('POST /api/v1/auth/register-user', () => {
    //   it('User should be registered succesfully', mochaAsync(async () => {
    //     const res = await apiRegulator
    //       .post('/api/v1/auth/register-user')
    //       .set('Content-Type', 'application/json')
    //       .send({
    //         enrollmentID: 'user1'
    //       })
    //     if (res.error) {
    //       res.error.status.should.equal(409);
    //       console.log('\twith expected 409 conflict error');
    //     }
    //   }));
    });