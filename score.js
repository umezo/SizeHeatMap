var _ = require('lodash');
var fs = require('fs');
var readline = require('readline');

getResolutionData('part-r-00000',function(err,result){
  data = calculateScore(result.data,result.maxW,result.maxH);
  console.error('output score');
  console.log(JSON.stringify({
    sample:result.data.length,
    width:result.maxW,
    height:result.maxH,
    score:data
  }));
});

function getResolutionData(file,done){
  var rs = fs.ReadStream(file);
  var rl = readline.createInterface({'input': rs, 'output': {}});

  var DATA_LIMIT = 100000* 2;
  var W_LIMIT = 2000;
  var H_LIMIT = 1500;

  var maxW = 0;
  var maxH = 0;
  var data = [];

  rl.on('line', function (d) {
    if(d.trim() === ''){
      return;
    }
    var param = d.split('\t');
    var w = Math.min(parseInt(param[3],10),W_LIMIT);
    var h = Math.min(parseInt(param[4],10),H_LIMIT);


    maxW = Math.max(maxW,w);
    maxH = Math.max(maxH,h);
    data.push([w,h]);
    if (data.length >= DATA_LIMIT) {
      rl.close();
    }
  });

  rl.on('close',function(){
    done(null,{
      data:data,
      maxW:maxW,
      maxH:maxH
    });
  });

  rl.resume();
}

function calculateScore(data,maxW,maxH){

  var score = new Array(maxW*maxH);
  for (var i = 0 ; i < score.length ; i++) {
    score[i] = 0;
  }

  data.forEach(function(rect,rowIndex){
    var w = rect[0];
    var h = rect[1];

    var i,j,index;

    for (j = 0 ; j < h ; j++) {
      for (i = 0 ; i < w ; i++) {
        index = j*maxW + i; 
        score[index]++;
      }
    }

    if (rowIndex%1000===0) {
      console.error(rowIndex+'/'+data.length);
    }
  });


  return score;
}



//  $.get('part-r-00000',{},function(data){
//    console.log('complete get part-r');
//    var maxW = 0;
//    var maxH = 0;
//    data = _.map( data.split('\n').slice(0,DATA_LIMIT) , function(d){
//    });
//    console.log('$.get [' + data.length + ']',maxW,maxH);
//    calculateScore(data,maxW,maxH,function(result){
//      console.log('score calcuration complete!!');
//      imageData = createHeatMap(canvas,maxW,maxH,result.score,result.maxScore);
//      canvas.width  = imageData.width;
//      canvas.height = imageData.height;
//      canvas.getContext('2d').putImageData(imageData,0,0);
//
//      $(canvas).css({width:canvas.width,height:canvas.height});
//      
//      console.timeEnd('createHeatMap');
//    });
//  });
//
//  function createHeatMap(canvas,w,h,score,maxScore) {
//    console.log(w,h,maxScore);
//
//    var ctx = canvas.getContext('2d');
//    var img = ctx.createImageData(w,h);
//    var data = img.data;
//    _.forEach(score,function(s,index){
//      var r = index * 4 + 0;
//      var g = index * 4 + 1;
//      var b = index * 4 + 2;
//      var a = index * 4 + 3;
//
//      var rate = parseInt(s/maxScore * 10,10) / 10;
//
//      data[r] = 255 * rate;
//      data[a] = 255;
//    });
//
//    return img;
//  }
//
//  function calculateScore(data,maxW,maxH,done){
//    maxW = Math.min(2000,maxW);
//    maxH = Math.min(2000,maxH);
//    console.log('max = ('+maxW+','+maxH+')');
//
//
//
//    var handler = {
//      progress:function(e){
//        console.log(e.data.progress);
//      },
//      complete:function(e){
//        done({score:e.data.score,maxScore:data.length});
//      }
//    };
//
//    console.log('Worker kick');
//    var worker = new Worker('worker.js');
//    worker.addEventListener('message',function(e){
//      console.log(e);
//      var data = e.data;
//      handler[data.cmd](e);
//    });
//    worker.postMessage({
//      cmd:'score',
//      data:data,
//      maxW:maxW,
//      maxH:maxH
//    });
//  }





