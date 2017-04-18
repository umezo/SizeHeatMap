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

function getResolutionData(file){
  //readlineってエラーイベント無いの？マジ？
  return new Promise( (resolve) => {
    const rs = fs.ReadStream(file);
    const readlineInterface = readline.createInterface({'input': rs, 'output': {}});

    const DATA_LIMIT = 100000 * 2;
    const W_LIMIT = 2000;
    const H_LIMIT = 1500;

    let maxW = 0;
    let maxH = 0;
    let data = [];

    readlineInterface.on('line', function (d) {
      if(d.trim() === ''){
        return;
      }
      const param = d.split('\t');
      const w = Math.min(parseInt(param[3], 10), W_LIMIT);
      const h = Math.min(parseInt(param[4], 10), H_LIMIT);

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
