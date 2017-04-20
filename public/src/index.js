/* eslint-disable no-console */
const $ = require('jquery');
const score = require('../score.json');

var canvas = $('#practiceCanvas')[0];

console.time('createHeatMap');

loadScore(score);

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

function loadScore(data) {
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
}

function createHeatMap(canvas, w, h, score, maxScore) {
  console.log(w, h, maxScore);

  var ctx = canvas.getContext('2d');
  var img = ctx.createImageData(w, h);
  var data = img.data;
  score.forEach(function(s, index){
    var r = index * 4 + 0;
    //var g = index * 4 + 1;
    //var b = index * 4 + 2;
    var a = index * 4 + 3;

    var rate = parseInt(s/maxScore * 10, 10) / 10;

    data[r] = 255 * rate;
    data[a] = 255 * (1-rate);
  });

  return img;
}
