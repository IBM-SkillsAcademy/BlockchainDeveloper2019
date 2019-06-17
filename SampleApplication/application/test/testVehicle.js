const chai = require('chai');
const supertest = require('supertest');

chai.should();
const STAGING_HOST_NAME = process.env.STAGING_HOST_NAME || 'http://localhost:3000';
const api = supertest(STAGING_HOST_NAME);

describe('Vehicle cycle: ', () => {
  const vehicle = {
    vehicleID: 'vehicle113',
    manufacturer: 'Tesla',
    model: 'Model 3',
    color: 'Space Grey',
    owner: 'Stark'
  };
  describe('POST /api/v1/vehicle', () => {
    it('Vehicle should be created succesfully', (done) => {
      api.post('/api/v1/vehicle')
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
      api.get('/api/v1/vehicle')
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

  describe('GET /api/v1/vehicle/:id', () => {
    it('Vehicle should be listed', (done) => {
      api.get('/api/v1/vehicle/' + vehicle.vehicleID)
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
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

  describe('POST /api/v1/vehicle/change-owner', () => {
    it('Vehicle ownership should be able to be changed', (done) => {
      api.post('/api/v1/vehicle/change-owner')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .send({
          vehicleID: vehicle.vehicleID,
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

  describe('GET /api/v1/vehicle/:id', () => {
    it('Vehicle ownership should already changed', (done) => {
      api.get('/api/v1/vehicle/' + vehicle.vehicleID)
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
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
      api.delete('/api/v1/vehicle/delete')
        .set('Content-Type', 'application/json')
        .set('enrollment-id', 'user1')
        .send({
          vehicleID: vehicle.vehicleID
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
