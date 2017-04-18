const $ = require('jquery');
const _ = require('lodash');

var canvas = $('#practiceCanvas')[0];

console.time('createHeatMap');

createGuide();
loadScore();

function createGuide(){
  var container = $('#container');
  for (var i = 1 ; i <= 10 ; i++) {
    var targetPix = i * 100;
    var div = $('<div class="guide"><div class="guide-label">'+targetPix+'px</div></div>');
    div.css({
      height: (targetPix-1) + 'px'
    });

    container.append(div);

  }
}

function loadScore(){
  $.getJSON('score.json', {}, function(data){
    var imageData = createHeatMap(
        canvas,
        data.width,
        data.height,
        data.score,
        data.sample
      );

    console.log('draw canvas');
    canvas.width  = imageData.width;
    canvas.height = imageData.height;
    canvas.getContext('2d').putImageData(imageData, 0, 0);

    $(canvas).css({width:canvas.width, height:canvas.height});
  });


}

function createHeatMap(canvas, w, h, score, maxScore) {
  console.log(w, h, maxScore);

  var ctx = canvas.getContext('2d');
  var img = ctx.createImageData(w, h);
  var data = img.data;
  _.forEach(score, function(s, index){
    var r = index * 4 + 0;
    var g = index * 4 + 1;
    var b = index * 4 + 2;
    var a = index * 4 + 3;

    var rate = parseInt(s/maxScore * 10, 10) / 10;

    data[r] = 255 * rate;
    data[a] = 255 * (1-rate);
  });

  return img;
}

function calculateScore(data, maxW, maxH, done){
  maxW = Math.min(2000, maxW);
  maxH = Math.min(2000, maxH);
  console.log('max = ('+maxW+','+maxH+')');



  var handler = {
    progress:function(e){
      console.log(e.data.progress);
    },
    complete:function(e){
      done({score:e.data.score, maxScore:data.length});
    }
  };

  console.log('Worker kick');
  var worker = new Worker('worker.js');
  worker.addEventListener('message', function(e){
    console.log(e);
    var data = e.data;
    handler[data.cmd](e);
  });
  worker.postMessage({
    cmd:'score',
    data:data,
    maxW:maxW,
    maxH:maxH
  });
}