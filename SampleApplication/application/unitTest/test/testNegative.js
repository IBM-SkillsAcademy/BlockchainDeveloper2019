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
  setTimeout(() => done(), 100)
});

describe('Negative Test for Enrollment and Registration: ', () => {
    describe('GET /api/v1/auth/registrar/enroll', () => {
      it('Cannot enroll an admin if an admin identity already exists in Manufacturer org', mochaAsync(async () => {
        const res = await apiManufacturer
          .get('/api/v1/auth/registrar/enroll')
          .set('Content-Type', 'application/json')
          .expect(409);
        res.body.message.should.include('An identity for the admin user "admin" already exists in the wallet');
      }));

      it('Cannot enroll an admin if an admin identity already exists in Regulator org', mochaAsync(async () => {
        const res = await apiRegulator
          .get('/api/v1/auth/registrar/enroll')
          .set('Content-Type', 'application/json')
          .expect(409);
        res.body.message.should.include('An identity for the admin user "admin" already exists in the wallet');
      }));

      it('Cannot enroll an admin if an admin identity already exists in Insurer org', mochaAsync(async () => {
        const res = await apiInsurer
          .get('/api/v1/auth/registrar/enroll')
          .set('Content-Type', 'application/json')
          .expect(409);
        res.body.message.should.include('An identity for the admin user "admin" already exists in the wallet');
      }));
    });
  
    describe('POST /api/v1/auth/user/register-enroll', () => {
      it('Cannot register user if user exists in Manufacturer network', mochaAsync(async () => {
        const res = await apiManufacturer
          .post('/api/v1/auth/user/register-enroll')
          .set('Content-Type', 'application/json')
          .send({
            enrollmentID: 'unitTestUser'
          })
          .expect(409);
          
        if (res.error) {
          res.error.status.should.equal(409);
          console.log('\twith expected 409 conflict error');
        }
      }));

      it('Cannot register user if user exists in Regulator network', mochaAsync(async () => {
        const res = await apiRegulator
          .post('/api/v1/auth/user/register-enroll')
          .set('Content-Type', 'application/json')
          .send({
            enrollmentID: 'unitTestUser'
          })
          .expect(409);
          
        if (res.error) {
          res.error.status.should.equal(409);
          console.log('\twith expected 409 conflict error');
        }
      }));

      it('Cannot register user if user exists in Insurer network', mochaAsync(async () => {
        const res = await apiRegulator
          .post('/api/v1/auth/user/register-enroll')
          .set('Content-Type', 'application/json')
          .send({
            enrollmentID: 'unitTestUser'
          })
          .expect(409);
          
        if (res.error) {
          res.error.status.should.equal(409);
          console.log('\twith expected 409 conflict error');
        }
      }));
    });
});

describe('Negative Test for Vehicle cycle: ', () => {
    const vehicle = {
      orderID: 'xxx123',
      manufacturer: 'Tesla',
      model: 'Model3',
      color: 'Space Grey',
      owner: 'Stark'
    };
    const key = `${vehicle.orderID}:${vehicle.model}`;
    const vin = 'G33KS';
    describe('POST /api/v1/vehicles/orders', () => {
      it('Cannot create order if using a non-existing identity', mochaAsync(async () => {
        const res = await apiManufacturer
          .post('/api/v1/vehicles/orders')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .send(vehicle)
          .expect(401);
        res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));
    });

    describe('GET /api/v1/vehicles/orders', () => {
      it('Cannot query all vehicle order using Manufacturer application if using non-existing identity', mochaAsync(async () => {
        const res = await apiManufacturer
          .get('/api/v1/vehicles/orders')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .expect(401)
        res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));

      it('Cannot query all vehicle order using Regulator application if using non-existing identity', mochaAsync(async () => {
        const res = await apiRegulator
          .get('/api/v1/vehicles/orders')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .expect(401)
        res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));
    });
    
    describe('POST /api/v1/vehicles', () => {
      it('Cannot create vehicle using Manufacturer application if using non-existing identity', mochaAsync(async () => {
        const res = await apiManufacturer
          .post('/api/v1/vehicles')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .send(vehicle)
          .expect(401);
        res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));
    });

    describe('GET /api/v1/vehicles', () => {
      it('Cannot query all vehicle using Manufacturer application if using non-existing identity', mochaAsync(async () => {
        const res = await apiManufacturer
          .get('/api/v1/vehicles')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .expect(401);
        res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));
  
      it('Cannot query all vehicle using Regulator application if using non-existing identity', mochaAsync(async () => {
        const res = await apiRegulator
          .get('/api/v1/vehicles')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .expect(401);
        res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));
  
      it('Cannot query all vehicle using Insurer application if using non-existing identity', mochaAsync(async () => {
        const res = await apiInsurer
          .get('/api/v1/vehicles')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .expect(401);
        res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));

      it('Cannot query vehicle by id using Manufacturer application if it doesent exist', mochaAsync(async () => {
        const res = await apiManufacturer
          .get('/api/v1/vehicles')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .query({
            id: key
          }).expect(500);
          res.text.should.include(`Vehicle with ID `+key+` doesn\'t exists`);
      }));
  
      it('Cannot query vehicle by id using Regulator application if it doesent exist', mochaAsync(async () => {
        const res = await apiRegulator
          .get('/api/v1/vehicles')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .query({
            id: key
          }).expect(500);
          res.text.should.include(`Vehicle with ID `+key+` doesn\'t exists`);
      }));
  
      it('Cannot query vehicle by id using Insurer application if it doesent exist', mochaAsync(async () => {
        const res = await apiInsurer
          .get('/api/v1/vehicles')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .query({
            id: key
          }).expect(500);
        res.text.should.include(`Vehicle with ID `+key+` doesn\'t exists`);
      }));
    });

    describe('POST /api/v1/vehicles/vin/request', () => {
      const vinRequest = {
        vehicleID: key,
      };
      it('Cannot request vehicle VIN using Manufacturer application if using non-existing identity', mochaAsync(async () => {
        const res = await apiManufacturer
          .post('/api/v1/vehicles/vin/request')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .send(vinRequest)
          .expect(401);
        res.body.message.should.include('An identity for the user user2 does not exist in the wallet');        
      }));

      it('Cannot request vehicle VIN using Manufacturer application if it doesent exist', mochaAsync(async () => {
        const res = await apiManufacturer
          .post('/api/v1/vehicles/vin/request')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .send(vinRequest)
          .expect(500);
        res.text.should.contain('No state exists for key '+key+' org.vehiclelifecycle.vehicle');
      }));
    });

    describe('PUT /api/v1/vehicles/policies/issue', () => {
      it('Cannot issue insurance for policy using Insurer application if using non-existing identity', mochaAsync(async () => {
        const res = await apiInsurer
          .put('/api/v1/vehicles/policies/issue')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .send({id: 'newPolicy'})
          .expect(401);
        res.body.message.should.include('An identity for the user user2 does not exist in the wallet');        
      }));

      it('Cannot issue insurance for policy using Insurer application for a policy that does not exist', mochaAsync(async () => {
        const res = await apiInsurer
          .put('/api/v1/vehicles/policies/issue')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .send({id: 'newPolicy'})
          .expect(500);
        res.text.should.contain('No state exists for key newPolicy org.vehiclelifecycle.policy');
      }));

      it('Cannot issue insurance for policy using Insurer application if missing id params', mochaAsync(async () => {
        const res = await apiInsurer
          .put('/api/v1/vehicles/policies/issue')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .expect(500);
        res.text.should.contain('undefined');        
      }));
    });

    describe('POST /api/v1/vehicles/prices', () => {
      const priceUpdate = {
        vehicleID: key,
        value: '40000'
      };
      it('Cannot update vehicle price using Manufacturer application if using non-existing identity', mochaAsync(async () => {
        const res = await apiManufacturer
          .post('/api/v1/vehicles/prices')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .send(priceUpdate)
          .expect(401);
        res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));

      it('Cannot update vehicle price using Manufacturer application if it doesent exist', mochaAsync(async () => {
        const res = await apiManufacturer
          .post('/api/v1/vehicles/prices')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .send(priceUpdate)
          .expect(500);
        res.text.should.contain('No state exists for key '+key+' org.vehiclelifecycle.vehicle');
      }));

      it('Cannot update vehicle price using Manufacturer application if missing vehicleID param', mochaAsync(async () => {
        const res = await apiManufacturer
          .post('/api/v1/vehicles/prices')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .send({
            price: '40000'
          })
          .expect(500);
        res.text.should.contain('undefined');
      }));
      
      it('Cannot update vehicle price using Manufacturer application if missing price param', mochaAsync(async () => {
        const res = await apiManufacturer
          .post('/api/v1/vehicles/prices')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .send({
            vehicleID: key,
          })
          .expect(500);
        res.text.should.contain('undefined');
      }));
    });

    describe('GET /api/v1/vehicles/prices/range', () => {
      it('Cannot query vehicle price by range using Manufacture application if using non-existing identity', mochaAsync(async () => {
        const res = await apiManufacturer
          .get('/api/v1/vehicles/prices/range')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .query({
            min: "10000",
            max: "50000"
          }).expect(401);
        res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));
  
      it('Cannot query vehicle price by range using Regulator application if using non-existing identity', mochaAsync(async () => {
        const res = await apiRegulator
          .get('/api/v1/vehicles/prices/range')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .query({
            min: "10000",
            max: "50000"
          }).expect(401);
          res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));
    });
    describe('PUT /api/v1/vehicles/orders', () => {
      it('Cannot update vehicle order status using Manufacturer application if using non-existing identity', mochaAsync(async () => {
        const res = await apiManufacturer
          .put('/api/v1/vehicles/orders')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .send({
            orderID: vehicle.orderID,
            status: 'PENDING'
          }).expect(401);
        res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));

      it('Cannot update vehicle order status using Manufacturer application if it doesent exist', mochaAsync(async () => {
        const res = await apiManufacturer
          .put('/api/v1/vehicles/orders')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .send({
            orderID: vehicle.orderID,
            status: 'PENDING'
          }).expect(500);
        res.text.should.contain('order '+vehicle.orderID+' doesn\'t exists');
      }));

      it('Cannot update vehicle order status using Manufacturer application if passing invalid status param', mochaAsync(async () => {
        const res = await apiManufacturer
          .put('/api/v1/vehicles/orders')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .send({
            orderID: vehicle.orderID,
            status: 'ISSUED'
          }).expect(400);
        res.body.message.should.contain('Status invalid: ISSUED. Should be PENDING, INPROGRESS, or DELIVERED')
      }));
    });

    describe('POST /api/v1/vehicles/owners/change', () => {
      it('Cannot change vehicle ownership using Regulator application if using non-existing identity', mochaAsync(async () => {
        const res = await apiRegulator
          .post('/api/v1/vehicles/owners/change')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .send({
            vehicleID: key,
            owner: 'Wayne'
          }).expect(401);
          res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));

      it('Cannot change vehicle ownership using Regulator application if it doesent exist', mochaAsync(async () => {
        const res = await apiRegulator
          .post('/api/v1/vehicles/owners/change')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .send({
            vehicleID: key,
            owner: 'Wayne'
          }).expect(500);
        res.text.should.contain('No state exists for key '+key+' org.vehiclelifecycle.vehicle');
      }));

      it('Cannot change vehicle ownership using Regulator application if missing owner param', mochaAsync(async () => {
        const res = await apiRegulator
          .post('/api/v1/vehicles/owners/change')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .send({
            vehicleID: key,
          }).expect(500);
        res.text.should.contain('undefined');
      }));
  
      it('Cannot change vehicle ownership using Insurer application if using non-existing identity', mochaAsync(async () => {
        const res = await apiInsurer
          .post('/api/v1/vehicles/owners/change')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .send({
            vehicleID: key,
            owner: 'John'
          }).expect(401);
          res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));

      it('Cannot change vehicle ownership using Insurer application if it doesent exist', mochaAsync(async () => {
        const res = await apiInsurer
          .post('/api/v1/vehicles/owners/change')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .send({
            vehicleID: key,
            owner: 'Wayne'
          }).expect(500);
        res.text.should.contain('No state exists for key '+key+' org.vehiclelifecycle.vehicle');
      }));
      
      it('Cannot change vehicle ownership using Insurer application if missing owner params', mochaAsync(async () => {
        const res = await apiInsurer
          .post('/api/v1/vehicles/owners/change')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .send({
            vehicleID: key,
          }).expect(500);
        res.text.should.contain('undefined');
      }));
    });

    describe('DELETE /api/v1/vehicles', () => {
      it('Cannot delete vehicle from ledger using Regulator application if using non-existing identity', mochaAsync(async () => {
        const res = await apiRegulator
          .delete('/api/v1/vehicles/delete')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'user2')
          .send({
            vehicleID: key
          })
          .expect(401);
          res.body.message.should.include('An identity for the user user2 does not exist in the wallet');
      }));

      it('Cannot delete vehicle from ledger using Regulator application if it doesent exist', mochaAsync(async () => {
        const res = await apiRegulator
          .delete('/api/v1/vehicles/delete')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .send({
            vehicleID: key
          })
          .expect(500);
        res.text.should.contain('vehicle with ID : '+key+' doesn\'t exists');
      }));

      it('Cannot delete vehicle from ledger using Regulator application if missing vehicleID params', mochaAsync(async () => {
        const res = await apiRegulator
          .delete('/api/v1/vehicles/delete')
          .set('Content-Type', 'application/json')
          .set('enrollment-id', 'unitTestUser')
          .expect(500);
        res.text.should.contain('undefined');
      }));
    });
  });
