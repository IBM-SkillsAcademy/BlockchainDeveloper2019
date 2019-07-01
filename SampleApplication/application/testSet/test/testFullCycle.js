const chai = require('chai');
const supertest = require('supertest');

chai.should();
const apiManufacturer = supertest('http://localhost:6001');
const apiRegulator = supertest('http://localhost:6002');
const apiInsurer = supertest('http://localhost:6003');

///////////////////// Registration Start /////////////////////
describe('Enrollment and Registration: ', () => {
  describe('GET /api/v1/auth/enroll-admin', () => {
    it('Admin should be enrolled succesfully', (done) => {
      apiManufacturer.get('/api/v1/auth/enroll-admin')
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

  describe('GET /api/v1/auth/enroll-admin', () => {
    it('Admin should be enrolled succesfully', (done) => {
      apiRegulator.get('/api/v1/auth/enroll-admin')
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

  describe('GET /api/v1/auth/enroll-admin', () => {
    it('Admin should be enrolled succesfully', (done) => {
      apiInsurer.get('/api/v1/auth/enroll-admin')
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


  describe('POST /api/v1/auth/register-user', () => {
    it('User should be registered succesfully', (done) => {
      apiManufacturer.post('/api/v1/auth/register-user')
        .set('Content-Type', 'application/json')
        .send({
          enrollmentID: 'user1'
        })
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

  describe('POST /api/v1/auth/register-user', () => {
    it('User should be registered succesfully', (done) => {
      apiRegulator.post('/api/v1/auth/register-user')
        .set('Content-Type', 'application/json')
        .send({
          enrollmentID: 'user1'
        })
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

  describe('POST /api/v1/auth/enroll-user', () => {
    it('User should be registered succesfully', (done) => {
      apiInsurer.post('/api/v1/auth/enroll-user')
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
/////////////////////  Registration End  /////////////////////

///////////////////// Vehicle Cycle Start /////////////////////
describe('Vehicle cycle: ', () => {
  const vehicle = {
    orderID: 'vehicle113',
    manufacturer: 'Tesla',
    model: 'Model 3',
    color: 'Space Grey',
    owner: 'Stark'
  };
  const key=`${vehicle.orderID}:${vehicle.model}`
  describe('POST /api/v1/vehicle', () => {
    it('Vehicle should be created succesfully', (done) => {
      apiManufacturer.post('/api/v1/vehicle')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .send(vehicle)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          return done();
        });
    });
  });

  describe('GET /api/v1/vehicle', () => {
    it('All vehicles should be listed', (done) => {
      apiInsurer.get('/api/v1/vehicle')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          return done();
        });
    });
  });

  describe('GET /api/v1/vehicle', () => {
    it('Vehicle should be listed', (done) => {
      apiRegulator.get('/api/v1/vehicle')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .query({id: key})
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.body.result.owner.should.equal('Stark');
          return done();
        });
    });
  });

  describe.skip('POST /api/v1/vehicle/price', () => {
    const priceUpdate = {
      vehicleID: key,
      price: '40000'
    };
    it('Vehicle price should be able to be updated', (done) => {
      apiManufacturer.post('/api/v1/vehicle/price')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .send(priceUpdate)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          return done();
        });
    })
  })

  describe.skip('GET /api/v1/vehicle/price', () => {
    it('Manufacture or Insurer should be able to see vehicle price', (done) => {
      apiRegulator.get('/api/v1/vehicle/price')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .query({id: key})
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.body.result.should.equal(40000);
          return done();
        });
    })
  })

  describe('POST /api/v1/vehicle/change-owner', () => {
    it('Vehicle ownership should be able to be changed', (done) => {
      apiRegulator.post('/api/v1/vehicle/change-owner')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .send({
          vehicleID: key,
          owner: 'Wayne'
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          return done();
        });
    });
  });

  describe('GET /api/v1/vehicle', () => {
    it('Vehicle ownership should already changed', (done) => {
      apiRegulator.get('/api/v1/vehicle')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .query({id: key})
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.body.result.owner.should.equal('Wayne');
          return done();
        });
    });
  });

  describe('DELETE /api/v1/vehicle', () => {
    it('Vehicle should be deleted succesfully', (done) => {
      apiRegulator.delete('/api/v1/vehicle/delete')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .send({
          vehicleID: key
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          return done();
        });
    });
  });
});
/////////////////////  Vehicle Cycle End  /////////////////////


