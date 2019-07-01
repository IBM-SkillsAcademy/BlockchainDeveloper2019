const chai = require('chai');
const supertest = require('supertest');
const shortid = require('shortid');

chai.should();
const apiManufacturer = supertest('http://localhost:6001');
const apiRegulator = supertest('http://localhost:6002');
const apiInsurer = supertest('http://localhost:6003');

beforeEach((done) => {
  setTimeout(() => done(), 500)
})

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
    orderID: shortid.generate(),
    manufacturer: 'Tesla',
    model: 'Model 3',
    color: 'Space Grey',
    owner: 'Stark'
  };
  const key=`${vehicle.orderID}:${vehicle.model}`
  describe('POSt /api/v1/vehicle/order', () => {
    it('Manufacturer can place order', (done) => {
      apiManufacturer.post('/api/v1/vehicle/order')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .send(vehicle)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          return done();
        });
        
    })
  });
  describe('POST /api/v1/vehicle', () => {
    it('Manufacturer can create vehicle', (done) => {
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
    it('All organizations can query all vehicle', (done) => {
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
    it('All organizations can query vehicle by id', (done) => {
      apiManufacturer.get('/api/v1/vehicle')
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

  describe('POST /api/v1/vehicle/price', () => {
    const priceUpdate = {
      vehicleID: key,
      price: '40000'
    };
    it('Manufacturer can update vehicle price', (done) => {
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

  describe('GET /api/v1/vehicle/price', () => {
    it('Manufacture or Insurer can see vehicle price', (done) => {
      apiManufacturer.get('/api/v1/vehicle/price')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .query({id: key})
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.body.result.price.should.equal("40000");
          return done();
        });
    })
  })

  describe('POST /api/v1/vehicle/change-owner', () => {
    it('Regulator can change vehicle ownership', (done) => {
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
    it('Regulator can see that the vehicle ownership is changed', (done) => {
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
    it('Regulator can delete vehicle from the ledger', (done) => {
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


