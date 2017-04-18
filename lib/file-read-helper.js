const fs = require( 'fs');
const readline = require( 'readline');
/**
 * @param {string} filepath 読み込むファイルのパス
 * @param {function} parseLineToWHArray 読み込んだファイルの一行を受け取って、[number, number] の配列に変換する関数
 * @param {?number} DATA_LIMIT ファイルから最大いくつのサンプルをよみこむか
 *
 * @return {Promise} successすると {data:{Array<Array<number>>}, maxW:{number} maxH:{number}}
 */
function readResolutionDataFile(filepath, parseLineToWHArray, DATA_LIMIT = null){
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
      if (DATA_LIMIT && data.length >= DATA_LIMIT) {
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

module.exports = {
  readResolutionDataFile
};
