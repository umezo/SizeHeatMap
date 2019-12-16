const parseCsv = require('csv-parse/lib/sync');
const path = require('path');
const fs = require('fs');

const viewPortCsvString = fs.readFileSync(path.join(__dirname, '../viewport.csv'),'utf8');

type ViewPort = {
    width: number;
    height: number;
    count: number;
}
const viewPortCsv = parseCsv(viewPortCsvString);
const viewPort: ViewPort[] = viewPortCsv.map((vp: string[]):ViewPort => {
    const [width, height] = vp[1].split('x').map(c => parseInt(c, 10));
    const count = parseInt(vp[2].replace(',',''), 10);
    return {
        width,
        height,
        count
    }
}).filter((vp: ViewPort) => !isNaN(vp.width) && !isNaN(vp.height));

console.log(viewPort);

const max: {
    width: number;
    height: number;
} = viewPort.reduce((result, vp) => {
    return {
        width: Math.max(result.width, vp.width),
        height: Math.max(result.height, vp.height),
    }
}, {width: viewPort[0].width, height: viewPort[0].height});

console.log(max);

const score = ((viewPorts: ViewPort[], maxW: number, maxH: number): number[] => {
  const score = new Array(maxW * maxH);

  for (let i = 0 ; i < score.length ; i++) {
    score[i] = 0;
  }

  viewPorts.forEach(function(vp,rowIndex){
    const w = vp.width;
    const h = vp.height;

    for (let j = 0 ; j < h ; j++) {
      for (let i = 0 ; i < w ; i++) {
        let index = j * maxW + i;
        score[index]++;
      }
    }

    if (rowIndex%1000===0) {
      console.error(rowIndex+'/'+viewPorts.length);
    }
  });


  return score;
})(viewPort, max.width, max.height);

fs.writeFileSync(fs.join(__dirname, '../score.json'), score, 'utf8');
