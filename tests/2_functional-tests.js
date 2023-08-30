const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  const requester = chai.request(server).keepOpen();
  const project = 'projecttest';
  const url = `/api/issues/${project}`;
  let testId = null;
  
  test('Create an issue with every field', function(done) {
    const data = {
      issue_title: 'Testcase 01',
      issue_text: 'Create an issue with every field.',
      created_by: 'TDT',
      assigned_to: 'TDT',
      status_text: 'In QA',
    };
    
    requester.post(url).send(data).end((err, res) => {
      assert.exists(res.body._id);
      testId = res.body._id;
      done();
    });
  });

  test('Create an issue with only required fields', function(done) {
    const data = {
      issue_title: 'Testcase 02',
      issue_text: 'Create an issue with only required fields.',
      created_by: 'TDT',
    };
    
    requester.post(url).send(data).end((err, res) => {
      assert.exists(res.body._id);
      done();
    });
  });

  test('Create an issue with missing required fields', function(done) {
    const data = {
      assigned_to: 'TDT',
      status_text: 'In Process',
    };
    
    requester.post(url).send(data).end((err, res) => {
      assert.equal(res.body.error, 'required field(s) missing');
      done();
    });
  });

  test('View issues on a project', function(done) {
    requester.get(url).end((err, res) => {
      assert.isArray(res.body);
      done();
    });
  });

  test('View issues on a project with one filter', function(done) {
    const query = {
      assigned_to: 'TDT',
    };
    
    requester.get(url).query(query).end((err, res) => {
      assert.isArray(res.body);
      done();
    });
  });

  test('View issues on a project with multiple filters', function(done) {
    const query = {
      assigned_to: 'TDT',
      status_text: 'In QA',
    };
    
    requester.get(url).query(query).end((err, res) => {
      assert.isArray(res.body);
      done();
    });
  });

  test('Update one field on an issue', function(done) {
    const data = {
      _id: testId,
      issue_text: 'Update one field on an issue',
    };
    
    requester.put(url).send(data).end((err, res) => {
      assert.equal(res.body.result, 'successfully updated');
      done();
    });
  });

  test('Update multiple fields on an issue', function(done) {
    const data = {
      _id: testId,
      issue_text: 'Update multiple fields on an issue',
      assigned_to: 'TDT',
    };
    
    requester.put(url).send(data).end((err, res) => {
      assert.equal(res.body.result, 'successfully updated');
      done();
    });
  });

  test('Update an issue with missing _id', function(done) {
    const data = {
      issue_text: 'Update an issue with missing _id',
    };
    
    requester.put(url).send(data).end((err, res) => {
      assert.equal(res.body.error, 'missing _id');
      done();
    });
  });
 
  test('Update an issue with no fields to update', function(done) {
    const data = {
      _id: testId,
    };
    
    requester.put(url).send(data).end((err, res) => {
      assert.equal(res.body.error, 'no update field(s) sent');
      done();
    });
  });
  
  test('Update an issue with an invalid _id', function(done) {
    const data = {
      _id: 'invalid_id',
      issue_text: 'Update an issue with an invalid _id',
    };
    
    requester.put(url).send(data).end((err, res) => {
      assert.equal(res.body.error, 'could not update');
      done();
    });
  });

  test('Delete an issue', function(done) {
    const data = {
      _id: testId,
    };
    
    requester.delete(url).send(data).end((err, res) => {
      assert.equal(res.body.result, 'successfully deleted');
      done();
    });
  });

  test('Delete an issue with an invalid _id', function(done) {
    const data = {
      _id: 'invalid_id',
    };
    
    requester.delete(url).send(data).end((err, res) => {
      assert.equal(res.body.error, 'could not delete');
      done();
    });
  });

  test('Delete an issue with missing _id', function(done) {
    requester.delete(url).send({}).end((err, res) => {
      assert.equal(res.body.error, 'missing _id');
      done();
    });
  });
});
