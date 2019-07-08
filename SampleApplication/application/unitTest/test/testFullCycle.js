const chai = require('chai');
const supertest = require('supertest');
const generate = require('nanoid/generate')

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
  setTimeout(() => done(), 100)
})

///////////////////// Registration Start /////////////////////
describe('Enrollment and Registration: ', () => {
  describe('GET /api/v1/auth/registrar/enroll', () => {
    it('Admin should be enrolled succesfully (Manufacture)', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/auth/registrar/enroll')
        .set('Content-Type', 'application/json')

      if (res.error) {
        res.error.status.should.equal(409);
        console.log('\twith expected 409 conflict error');
      }
    }));
  });

  describe('GET /api/v1/auth/registrar/enroll', () => {
    it('Admin should be enrolled succesfully (Regulator)', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/auth/registrar/enroll')
        .set('Content-Type', 'application/json')

      if (res.error) {
        res.error.status.should.equal(409);
        console.log('\twith expected 409 conflict error');
      }
    }));
  });

  describe('GET /api/v1/auth/registrar/enroll', () => {
    it('Admin should be enrolled succesfully (Insurer)', mochaAsync(async () => {
      const res = await apiInsurer
        .get('/api/v1/auth/registrar/enroll')
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
      
      if(res.error) {
        res.error.text.should.contain('Affiliation already exists');
        console.log('\twith expected affiliatian exists error');
      } else {
        res.status.should.equal(200);
      }
    }));
  });

  describe('POST /api/v1/auth/user/register-enroll', () => {
    it('User should be registered succesfully (Manufacture)', mochaAsync(async () => {
      const res = await apiManufacturer
        .post('/api/v1/auth/user/register-enroll')
        .set('Content-Type', 'application/json')
        .send({
          enrollmentID: 'unitTestUser'
        })
      if (res.error) {
        res.error.status.should.equal(409);
        console.log('\twith expected 409 conflict error');
      }
    }));
  });

  describe('POST /api/v1/auth/user/register-enroll', () => {
    it('User should be registered succesfully (Regulator)', mochaAsync(async () => {
      const res = await apiRegulator
        .post('/api/v1/auth/user/register-enroll')
        .set('Content-Type', 'application/json')
        .send({
          enrollmentID: 'unitTestUser'
        })
      if (res.error) {
        res.error.status.should.equal(409);
        console.log('\twith expected 409 conflict error');
      }
    }));
  });

  describe('POST /api/v1/auth/user/register-enroll', () => {
    it('User should be registered succesfully (Insurer)', mochaAsync(async () => {
      const res = await apiInsurer
        .post('/api/v1/auth/user/register-enroll')
        .set('Content-Type', 'application/json')
        .send({
          enrollmentID: 'unitTestUser'
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
    orderID: `vehicle${generate('1234567890abcdef', 4)}`,
    manufacturer: 'Tesla',
    model: 'Model3',
    color: 'Space Grey',
    owner: 'Stark'
  };
  const key = `${vehicle.orderID}:${vehicle.model}`;
  const policyRequest = {
    id: `policy${generate('1234567890abcdef', 4)}`,
    vehicleNumber: key,
    insurerId: 'insurer1',
    holderId: 'holder1',
    policyType: 'THIRD_PARTY',
    startDate: '12122019',
    endDate: '31122019'
  }
  const vin = `vin${generate('1234567890abcdef', 4)}`;
  describe('POST /api/v1/vehicles/orders', () => {
    it('Manufacturer can place order', mochaAsync(async () => {
      const res = await apiManufacturer
        .post('/api/v1/vehicles/orders')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .send(vehicle)
        .expect(200)
    }));
  });

  describe('GET /api/v1/vehicles/orders', () => {
    it('Manufacturer can query all vehicle order', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicles/orders')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .expect(200)
      res.body.result.length.should.above(0);
    }));

    it('Regulator can query all vehicle order', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/vehicles/orders')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .expect(200)
      res.body.result.length.should.above(0);
    }));
  });

  describe('GET /api/v1/vehicles/orders', () => {
    it('Manufacturer can query vehicle by id', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicles/orders')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          id: vehicle.orderID
        })
        .expect(200)
      res.body.result.orderStatus.should.equal('ISSUED');
    }));

    it('Regulator can query vehicle by id', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/vehicles/orders')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          id: vehicle.orderID
        })
        .expect(200)
      res.body.result.orderStatus.should.equal('ISSUED');
    }));
  });

  describe('GET /api/v1/vehicles/orders/status', () => {
    it('Manufacturer can query Order by status', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicles/orders/status')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          status: 'ISSUED'
        })
        .expect(200)
      res.body.result[0].record.orderStatus.should.equal('ISSUED');
    }));

    it('Regulator can query vehicle by status', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/vehicles/orders/status')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          status: 'ISSUED'
        })
        .expect(200)
      res.body.result[0].record.orderStatus.should.equal('ISSUED');
    }));
  });

  describe('PUT /api/v1/vehicles/orders', () => {
    it('Manufacturer can can update  status To be delivered ', mochaAsync(async () => {
      const res = await apiManufacturer
        .put('/api/v1/vehicles/orders')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .send({
          orderID: vehicle.orderID,
          status: 'DELIVERED'
        })
        .expect(200)
    }));
  });
  describe('POST /api/v1/vehicles', () => {
    it('Manufacturer can create vehicle', mochaAsync(async () => {
      const res = await apiManufacturer
        .post('/api/v1/vehicles')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .send(vehicle)
        .expect(200)
    }));
  });

  describe('GET /api/v1/vehicles', () => {
    it('Manufacturer can query all vehicle', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicles')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .expect(200)
    }));

    it('Regulator can query all vehicle', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/vehicles')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .expect(200)
    }));

    it('Insurer can query all vehicle', mochaAsync(async () => {
      const res = await apiInsurer
        .get('/api/v1/vehicles')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .expect(200)
    }));
  });

  describe('GET /api/v1/vehicles', () => {
    it('Manufacturer can query vehicle by id', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicles')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          id: key
        })
        .expect(200)
    }));

    it('Regulator can query vehicle by id', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicles')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          id: key
        })
        .expect(200)
    }));

    it('Insurer can query vehicle by id', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicles')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          id: key
        })
        .expect(200)
    }));
  });

  describe('POST /api/v1/vehicles/prices', () => {
    const priceUpdate = {
      vehicleID: key,
      price: '40000'
    };
    it('Manufacturer can update vehicle price', mochaAsync(async () => {
      const res = await apiManufacturer
        .post('/api/v1/vehicles/prices')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .send(priceUpdate)
        .expect(200)
    }));
  });

  describe('GET /api/v1/vehicles/prices', () => {
    it('Manufacture can see vehicle price', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicles/prices')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          id: key
        })
        .expect(200)
      res.body.result.price.should.equal(40000);
    }));

    it('Regulator can see vehicle price', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/vehicles/prices')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          id: key
        })
        .expect(200)
      res.body.result.price.should.equal(40000);
    }));
  });

  describe('GET /api/v1/vehicles/prices/range', () => {
    it('Manufacture can query vehicle price by range', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicles/prices/range')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          min: "10000",
          max: "50000"
        })
        .expect(200)
      res.body.result.length.should.above(0);
    }));

    it('Regulator can query vehicle price by range', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/vehicles/prices/range')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          min: "10000",
          max: "50000"
        })
        .expect(200)
      res.body.result.length.should.above(0);
    }));
  });

  describe('PUT /api/v1/vehicles/orders', () => {
    it('Manufacturer can can update vehicle order status', mochaAsync(async () => {
      const res = await apiManufacturer
        .put('/api/v1/vehicles/orders')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .send({
          orderID: vehicle.orderID,
          status: 'PENDING'
        })
        .expect(200)
    }));
  });

  describe('POST /api/v1/vehicles/owners/change', () => {
    it('Regulator can change vehicle ownership', mochaAsync(async () => {
      const res = await apiRegulator
        .post('/api/v1/vehicles/owners/change')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .send({
          vehicleID: key,
          owner: 'Wayne'
        })
        .expect(200)
    }));

    it('Insurer can change vehicle ownership', mochaAsync(async () => {
      const res = await apiInsurer
        .post('/api/v1/vehicles/owners/change')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .send({
          vehicleID: key,
          owner: 'John'
        })
        .expect(200)
    }));
  });

  describe('GET /api/v1/vehicles', () => {
    it('Regulator can see that the vehicle ownership is changed', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/vehicles')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          id: key
        })
        .expect(200)
    }));
  });

  describe('POST /api/v1/policies/request', () => {
    it('Manufacturer can request insurance policy for a vehicle', mochaAsync(async () => {
      const res = await apiManufacturer
        .post('/api/v1/vehicles/policies/request')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .send(policyRequest)
        .expect(200)
    }));
  });

  describe('GET /api/v1/policies', () => {
    it('Manufacturer can view all policies for vehicles', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicles/policies')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .expect(200)
    }));
    it('Regulator can view all policies for vehicles', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/vehicles/policies')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .expect(200)
    }));
    it('Insurer can view all policies for vehicles', mochaAsync(async () => {
      const res = await apiInsurer
        .get('/api/v1/vehicles/policies')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .expect(200)
    }));
  });

  describe('GET /api/v1/vehicles/policies', () => {
    it('Manufacturer can view policy for a vehicle', mochaAsync(async () => {
      const res = await apiManufacturer
        .get('/api/v1/vehicles/policies')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          id: policyRequest.id
        })
        .expect(200)
    }));
    it('Regulator can view policy for a vehicle', mochaAsync(async () => {
      const res = await apiRegulator
        .get('/api/v1/vehicles/policies')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          id: policyRequest.id
        })
        .expect(200)
    }));
    it('Insurer can view policy for a vehicle', mochaAsync(async () => {
      const res = await apiInsurer
        .get('/api/v1/vehicles/policies')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .query({
          id: policyRequest.id
        })
        .expect(200)
    }));
  });

  describe('PUT /api/v1/vehicles/policies/issue', () => {
    it('Insurer can issue insurance policy for a vehicle', mochaAsync(async () => {
      const res = await apiInsurer
        .put('/api/v1/vehicles/policies/issue')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .send({id: policyRequest.id})
        .expect(200)
    }));
  })

  describe('POST /api/v1/vehicles/vin/request', () => {
    const vinRequest = {
      vehicleID: key,
    };
    it('Manufacturer can request vehicle VIN', mochaAsync(async () => {
      const res = await apiManufacturer
        .post('/api/v1/vehicles/vin/request')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .send(vinRequest)
        .expect(200)
    }));
  });

  describe('POST /api/v1/vehicles/vin/issue', () => {
    const vinRequest = {
      vehicleID: key,
      vin: vin
    };
    it('Regulator can issue vehicle VIN', mochaAsync(async () => {
      const res = await apiRegulator
        .post('/api/v1/vehicles/vin/issue')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .send(vinRequest)
        .expect(200)
    }));
  });

  describe('DELETE /api/v1/vehicles', () => {
    it('Regulator can delete vehicle from the ledger', mochaAsync(async () => {
      const res = await apiRegulator
        .delete('/api/v1/vehicles/delete')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'unitTestUser')
        .send({
          vehicleID: key
        })
        .expect(200)
    }));
  });

it('Regulator can query vehicles count', mochaAsync(async () => {
  const res = await apiRegulator
    .get('/api/v1/vehicles/count')
    .set('Content-Type', 'application/json')
    .set('enrollment-id', 'unitTestUser')
    .expect(200)
}));

});




/////////////////////  Vehicle Cycle End  /////////////////////
