const test = require('ava');
const sinon = require('sinon');
const { readResolutionDataFile } = require( '../../lib/file-read-helper');

test('ファイルを読み込んで処理できる', async (t) => {
  const stub = sinon.stub();
  stub.onCall(0).returns([10, 20]);
  stub.onCall(1).returns([ 5, 30]);
  stub.onCall(2).returns([15, 10]);

  const result = await readResolutionDataFile( __dirname + '/../fixture/data-source.tsv', stub);
  t.deepEqual(stub.callCount, 3, '3行あるから');
  t.deepEqual(stub.args[0][0], 'foo1	foo2	foo3');
  t.deepEqual(stub.args[1][0], 'bar1	bar2	bar3');
  t.deepEqual(stub.args[2][0], 'baz1	baz2	baz3');
  t.deepEqual(result.data, [[10, 20], [ 5, 30], [15, 10]]);
  t.deepEqual(result.maxW, 15);
  t.deepEqual(result.maxH, 30);
});