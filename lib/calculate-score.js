/**
 * @param {Array<Array<number>>} data ブラウザのサイズを表す[幅, 高さ]の配列
 * @param {number} maxW dataの中の最大の幅
 * @param {number} maxH dataの中の最大の幅
 *
 * @return {Array<number} maxW x maxH の配列を一次元で表した物。各値にはその地点を表示できたサンプルの数が入る
 *                        ex) 10 x 10 の場合は 1,1 〜 10,10 の 100pxが表示できるはずなので、該当する要素に +1される 
 */
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
      /* eslint-disable no-console */
      console.error(rowIndex+'/'+data.length);
      /* eslint-enable no-console */
    }
  });


  return score;
}

module.exports = {
  calculateScore
};
