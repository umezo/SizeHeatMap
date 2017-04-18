const test = require('ava');
const sinon = require('sinon');
const { calculateScore } = require( '../../lib/calculate-score');

test('集計できる', async (t) => {
  const result = calculateScore( [
    [ 5, 7],
    [ 5, 7],
    [ 5, 7],
    [ 5, 7],
    [ 7, 3],
    [ 1, 1],
  ], 7, 7);

  t.deepEqual(result.length, 7 * 7);
  t.deepEqual(result, [
    6, 5, 5, 5, 5, 1, 1,
    5, 5, 5, 5, 5, 1, 1,
    5, 5, 5, 5, 5, 1, 1,
    4, 4, 4, 4, 4, 0, 0,
    4, 4, 4, 4, 4, 0, 0,
    4, 4, 4, 4, 4, 0, 0,
    4, 4, 4, 4, 4, 0, 0,
  ]);
});

