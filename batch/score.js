/* eslint-disable no-console */
const commander = require('commander');
const { readResolutionDataFile } = require( '../lib/file-read-helper');
const { calculateScore } = require( '../lib/calculate-score');

const DATA_LIMIT = 100000 * 2;
const W_LIMIT = 2000;
const H_LIMIT = 1500;


commander
  .option('--file [filepath]', 'path to resolution data')
  .parse(process.argv);

  console.log(commander);

readResolutionDataFile(commander.file, parseLineToWHArray, DATA_LIMIT)
  .then(function(result){
    const data = calculateScore(result.data, result.maxW, result.maxH);
    console.error('output score');
    console.log(JSON.stringify({
      sample:result.data.length,
      width:result.maxW,
      height:result.maxH,
      score:data
    }));
  })
  .catch(function (error){
    throw error;
  });

/**
 * 1980x1080\t2000 みたいな行をパースする
 */
function parseLineToWHArray(line) {
  console.log(line);
  const param = line.split('\t');
  const resolution = param[0].split('x');

  if (resolution.length < 2) {
    return null;
  }

  const w = Math.min(parseInt(resolution[0], 10), W_LIMIT);
  const h = Math.min(parseInt(resolution[1], 10), H_LIMIT);
  const count = parseInt(param[1], 10);

  return [w, h, count];
}
