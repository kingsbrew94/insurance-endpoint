/**
 * @author K.B. Brew <kingsleybrew@gmail.com>
 * @version 1.0
 */
const 
      request      = require('supertest'),
      assert       = require('assert'),
      mongoose     = require('mongoose'),
      fetch        = require('node-fetch'),
      Calculator   = require('../calculator'),
      Endpoint     = require('../endpoint');

      connection   = require('../connection'),
      schemas      = require('../schemas'),
      {app}        = require('../index'),
      TEST_TIMEOUT = 100000;
;

describe('Test Server',function() {
  this.timeout(TEST_TIMEOUT);
  it('should return response object',(done) => {
   request(app)
    .post('/calculate_insurance')
    .end(done)
  })
});

describe('Test End Point Request',function() {
    this.timeout(TEST_TIMEOUT);
    it('should make a post request with the type \'Third Party\' and car id \'1\' to the endpoint and return an object payload', (done) => {
      
        fetch(
            'https://insurance-endpoint.herokuapp.com/calculate_insurance?type=Third Party&car_id=1',
            {method: 'POST'}
        )
        .then(response => response)
        .then(data => {
            assert.equal(typeof data,'object');
            done();
        })
        .catch(err => done(err));
    });

    it('should make a post request with the type \'Comprehensive\' and car id \'1\' to the endpoint and return an object payload', (done) => {
        fetch(
            'https://insurance-endpoint.herokuapp.com/calculate_insurance?type=Comprehensive&car_id=1',
            {method: 'post'}
        )
        .then(response => response.json())
        .then(data => {
            assert.equal(typeof data,'object');
            done();
        })
        .catch(err => done(err));
    });

  }
);

describe('Test Shema',function() {
  this.timeout(TEST_TIMEOUT);
  it('should return data models object', () => {
    const schm = schemas(mongoose);
    assert.equal(typeof schm,'object');
  });
});

describe('Test Cloud Connection', function() {
  this.timeout(TEST_TIMEOUT);
  it('should connect to the mongo cloud',  (done) => {
    connection((md) => {
      assert.equal(typeof md,'object');
      done();
    });
  });
});

describe('Test End Point',function(){
  this.timeout(TEST_TIMEOUT);
  it('should initialize data stored in the cloud locally',(done) => {
    connection(async (md) => {
      const endpoint = new Endpoint({type: 'Comprehensive', car_id: '1'},schemas(md));
      await endpoint.setStore();
      done();
    });  
  });

  it('should get local store object', (done) => {
    connection(async (md) => {
      const endpoint = new Endpoint({type: 'Comprehensive', car_id: '1'},schemas(md));
      assert.equal(typeof endpoint.getStore(),'object');
      done();
    }); 
  });
});

describe('Test Calculator', function(){
  this.timeout(TEST_TIMEOUT *1000*3600);
  it('should return an object payload for a comprehensive insurance price result',(done) => {
    connection((md) => {
      const calculator = new Calculator({type: 'Comprehensive', car_id: '1'},schemas(md));
      calculator.calculateInsurance((payload) => {
        assert.equal(typeof payload,'object');
        done();
      });
    });
  });

  it('should return an object payload for a third party insurance price result',(done) => {
    connection((md) => {
      const calculator = new Calculator({type: 'Third Party', car_id: '1'},schemas(md));
      calculator.calculateInsurance((payload) => {
        assert.equal(typeof payload,'object');
        done();
      });
    });
  });
});
