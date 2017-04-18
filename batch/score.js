/* eslint-disable no-console */
var fs = require('fs');
var readline = require('readline');

getResolutionData('part-r-00000', function(err, result){
  const data = calculateScore(result.data, result.maxW, result.maxH);
  console.error('output score');
  console.log(JSON.stringify({
    sample:result.data.length,
    width:result.maxW,
    height:result.maxH,
    score:data
  }));
});

const DATA_LIMIT = 100000 * 2;
const W_LIMIT = 2000;
const H_LIMIT = 1500;

function parseLineToWHArray(line) {
  const param = line.split('\t');
  const w = Math.min(parseInt(param[3], 10), W_LIMIT);
  const h = Math.min(parseInt(param[4], 10), H_LIMIT);

  return [w, h];
}


/**
 * @param {string} filepath 読み込むファイルのパス
 * @param {function} 読み込んだファイルの一行を受け取って、[number, number] の配列に変換する関数
 *
 * @return {Promise} successすると {data:{Array<Array<number>>}, maxW:{number} maxH:{number}}
 */
function getResolutionData(filepath, parseLineToWHArray){
  //readlineってエラーイベント無いの？マジ？
  return new Promise( (resolve) => {
    const rs = fs.ReadStream(filepath);
    const readlineInterface = readline.createInterface({'input': rs, 'output': {}});

    let maxW = 0;
    let maxH = 0;
    let data = [];

    readlineInterface.on('line', function (line) {
      if(line.trim() === ''){
        return;
      }

      const [w, h] = parseLineToWHArray(line);

      maxW = Math.max(maxW, w);
      maxH = Math.max(maxH, h);
      data.push([w, h]);
      if (data.length >= DATA_LIMIT) {
        readlineInterface.close();
      }
    });

    readlineInterface.on('close', function(){
      resolve({
        data:data,
        maxW:maxW,
        maxH:maxH
      });
    });

    readlineInterface.resume();
  });
}

function calculateScore(data, maxW, maxH){

  let score = new Array(maxW*maxH);
  for (var i = 0 ; i < score.length ; i++) {
    score[i] = 0;
  }

  data.forEach(function(rect, rowIndex){
    const w = rect[0];
    const h = rect[1];

    let i, j, index;

    for (j = 0 ; j < h ; j++) {
      for (i = 0 ; i < w ; i++) {
        index = j * maxW + i;
        score[index]++;
      }
    }

    if (rowIndex % 1000 === 0) {
      console.error(rowIndex+'/'+data.length);
    }
  });


  return score;
}
