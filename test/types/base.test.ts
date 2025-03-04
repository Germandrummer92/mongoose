import * as mongoose from 'mongoose';
import { expectType } from 'tsd';

Object.values(mongoose.models).forEach(model => {
  model.modelName;
  model.findOne();
});

mongoose.pluralize(null);

function gh10746() {
  type A = string extends Function ? never : string;

  let testVar: A;
  testVar = 'A string';
  testVar = 'B string';
  expectType<string>(testVar);
}

function gh10957() {
  type TestType = { name: string };
  const obj: TestType = { name: 'foo' };

  expectType<TestType>(mongoose.trusted(obj));
}

function connectionStates() {
  const m: mongoose.Mongoose = new mongoose.Mongoose();

  m.STATES.connected;
  m.ConnectionStates.connected;

  m.connect('mongodb://localhost:27017/test').then(() => {
    console.log('Connected!');
  });

  m.syncIndexes().then(() => console.log('Synced indexes!'));

  m.Promise = Promise;
}