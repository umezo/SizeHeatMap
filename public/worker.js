self.addEventListener('message', function(e){
  self[e.data.cmd](e);
});

self.score = function(e){
  var data = e.data.data;
  var maxW = e.data.maxW;
  var maxH = e.data.maxH;

  var score = new Array(maxW*maxH);
  for (var i = 0 ; i < score.length ; i++) {
    score[i] = 0;
  }

  data.forEach(function(rect, rowIndex){
    var w = Math.min(rect[0], maxW);
    var h = Math.min(rect[1], maxH);

    for (var j = 0 ; j < h ; j++) {
      for (var i = 0 ; i < w ; i++) {
        var index = j*maxW + i;
        score[index]++;

      }
    }

    if (rowIndex%1000===0) {
      console.log(rowIndex+'/'+data.length);
    }
  });
  self.postMessage({cmd:'complete', score:score});
};
