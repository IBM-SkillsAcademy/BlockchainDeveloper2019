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
})

///////////////////// Registration Start /////////////////////
describe('Enrollment and Registration: ', () => {
  describe('GET /api/v1/auth/enroll-admin', () => {
    it('Admin should be enrolled succesfully', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/auth/enroll-admin')
        .set('Content-Type', 'application/json')

      if (res.error) {
        res.error.status.should.equal(409);
        console.log('\twith expected 409 conflict error');
      }
    }));
  });

  describe('GET /api/v1/auth/enroll-admin', () => {
    it('Admin should be enrolled succesfully', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/auth/enroll-admin')
        .set('Content-Type', 'application/json')

      if (res.error) {
        res.error.status.should.equal(409);
        console.log('\twith expected 409 conflict error');
      }
    }));
  });

  describe('GET /api/v1/auth/enroll-admin', () => {
    it('Admin should be enrolled succesfully', mochaAsync(async () => {
      const res = await apiInsurer
        .get('/api/v1/auth/enroll-admin')
        .set('Content-Type', 'application/json')

      if (res.error) {
        res.error.status.should.equal(409);
        console.log('\twith expected 409 conflict error');
      }
    }));
  });

  describe('GET /api/v1/auth/create-affiliation', () => {
    it('Org3 affiliation should be created succesfully', mochaAsync(async () => {
      const res = await apiInsurer
        .get('/api/v1/auth/create-affiliation')
        .set('Content-Type', 'application/json')

      res.status.should.equal(200);
    }));
  });

  describe('POST /api/v1/auth/register-user', () => {
    it('User should be registered succesfully', mochaAsync(async () => {
      const res = await apiManufacturer
        .post('/api/v1/auth/register-user')
        .set('Content-Type', 'application/json')
        .send({
          enrollmentID: 'user1'
        })
      if (res.error) {
        res.error.status.should.equal(409);
        console.log('\twith expected 409 conflict error');
      }
    }));
  });

  describe('POST /api/v1/auth/register-user', () => {
    it('User should be registered succesfully', mochaAsync(async () => {
      const res = await apiRegulator
        .post('/api/v1/auth/register-user')
        .set('Content-Type', 'application/json')
        .send({
          enrollmentID: 'user1'
        })
      if (res.error) {
        res.error.status.should.equal(409);
        console.log('\twith expected 409 conflict error');
      }
    }));
  });

  describe('POST /api/v1/auth/register-user', () => {
    it('User should be registered succesfully', mochaAsync(async () => {
      const res = await apiInsurer
        .post('/api/v1/auth/register-user')
        .set('Content-Type', 'application/json')
        .send({
          enrollmentID: 'user1'
        })
      if (res.error) {
        res.error.status.should.equal(409);
        console.log('\twith expected 409 conflict error');
      }
    }));
  });
});
/////////////////////  Registration End  /////////////////////

///////////////////// Vehicle Cycle Start /////////////////////
describe('Vehicle cycle: ', () => {
  const vehicle = {
    orderID: shortid.generate(),
    manufacturer: 'Tesla',
    model: 'Model3',
    color: 'Space Grey',
    owner: 'Stark'
  };
  const key = `${vehicle.orderID}:${vehicle.model}`
  describe('POST /api/v1/vehicle/order', () => {
    it('Manufacturer can place order', mochaAsync(async () => {
      const res = await apiManufacturer
        .post('/api/v1/vehicle/order')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .send(vehicle)
        .expect(200)
    }));
  });

  describe('GET /api/v1/vehicle/order', () => {
    it('Manufacturer and Regulator can query all vehicle order', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicle/order')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .expect(200)
      res.body.result.length.should.above(0);
    }));
  });

  describe('GET /api/v1/vehicle/order', () => {
    it('Manufacturer and Regulator can query vehicle by status', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicle/order')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .query({
          status: "ISSUED"
        })
        .expect(200)
      res.body.result[0].orderStatus.should.equal(0);
    }));
  });

  describe('POST /api/v1/vehicle', () => {
    it('Manufacturer can create vehicle', mochaAsync(async () => {
      const res = await apiManufacturer
        .post('/api/v1/vehicle')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .send(vehicle)
        .expect(200)
    }));
  });

  describe('GET /api/v1/vehicle', () => {
    it('All organizations can query all vehicle', mochaAsync(async () => {
      const res = await apiInsurer
        .get('/api/v1/vehicle')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .expect(200)
    }));
  });

  describe('GET /api/v1/vehicle', () => {
    it('All organizations can query vehicle by id', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicle')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .query({
          id: key
        })
        .expect(200)
    }));
  });

  describe('POST /api/v1/vehicle/price', () => {
    const priceUpdate = {
      vehicleID: key,
      price: '40000'
    };
    it('Manufacturer can update vehicle price', mochaAsync(async () => {
      const res = apiManufacturer
        .post('/api/v1/vehicle/price')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .send(priceUpdate)
        .expect(200)
    }));
  });

  describe.skip('GET /api/v1/vehicle/price', () => {
    it('Manufacture or Insurer can see vehicle price', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/vehicle/price')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .query({
          id: key
        })
        .expect(200)
      res.body.result.price.should.equal("40000");
    }));
  });

  describe('POST /api/v1/vehicle/change-owner', () => {
    it('Regulator can change vehicle ownership', mochaAsync(async () => {
      const res = await apiRegulator
        .post('/api/v1/vehicle/change-owner')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .send({
          vehicleID: key,
          owner: 'Wayne'
        })
        .expect(200)
    }));
  });

  describe('GET /api/v1/vehicle', () => {
    it('Regulator can see that the vehicle ownership is changed', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/vehicle')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .query({
          id: key
        })
        .expect(200)
    }));
  });

  describe('DELETE /api/v1/vehicle', () => {
    it('Regulator can delete vehicle from the ledger', mochaAsync(async () => {
      const res = await apiRegulator
        .delete('/api/v1/vehicle/delete')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .send({
          vehicleID: key
        })
        .expect(200)
    }));
  });
});
/////////////////////  Vehicle Cycle End  /////////////////////