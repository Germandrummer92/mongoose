/**
 * Module dependencies.
 */

'use strict';

const start = require('./common');

const assert = require('assert');

const mongoose = start.mongoose;
const Schema = mongoose.Schema;

describe('Projections', function() {
  let db;
  let Model;

  before(function() {
    db = start();
  });

  after(async function() {
    await db.close();
  });

  beforeEach(() => db.deleteModel(/.*/));
  afterEach(() => require('./util').clearTestData(db));
  afterEach(() => require('./util').stopRemainingOps(db));


  beforeEach(function() {
    const schema = new Schema({ name: String, toBeRemoved: { type: String, select: false } });

    Model = db.model('Test', schema);

    return Model.create({ name: 'Axl', toBeRemoved: 'someString' }, { name: 'Slash', toBeRemoved: 'someOtherString' });
  });

  it('it can handle projections in any order', async() => {
    const query1 = Model.find({});
    query1.projection({ _id: 0, name: 1 });
    const result1 = await query1.lean();


    const query2 = Model.find({});
    query2.projection({ name: 1, _id: 0 });
    const result2 = await query2.lean();
    assert.deepEqual(result1, result2);
  });

  it('does not crash on sending exclusion and inclusion', async() => {
    const query = Model.find({});
    query.projection({ name: 0, toBeRemoved: 1 });

    let result;
    await assert.doesNotReject(async() => {
      result = await query;
    });

    assert.equal(result[0].toBeRemoved, undefined);

  });

});
