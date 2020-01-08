import {ViewPort} from "./index";

const parseCsv = require('csv-parse/lib/sync');
const path = require('path');
const fs = require('fs');
const {createCanvas} = require('canvas');

const LIMIT_WIDTH = 2000;
const LIMIT_HEIGHT = 1000;
const viewPortCsvString = fs.readFileSync(path.join(__dirname, '../viewport.csv'),'utf8');

const viewPortCsv = parseCsv(viewPortCsvString);
const viewPort: ViewPort[] = viewPortCsv.map((vp: string[]):ViewPort => {
    const [width, height] = vp[1].split('x').map(c => parseInt(c, 10));
    const count = parseInt(vp[2].replace(',',''), 10);
    return {
        width: Math.min(width, LIMIT_WIDTH),
        height: Math.min(height, LIMIT_HEIGHT),
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

const maxScore = score.reduce((result, score) => Math.max(result, score));
const canvas = ((score: number[], width:number, height: number, max: number) => {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const img = ctx.getImageData(0,0,width, height);

    score.forEach((s,index) => {
        const r = index * 4 + 0;
        const g = index * 4 + 1;
        const b = index * 4 + 2;
        const a = index * 4 + 3;

        const rate = Math.floor(s / max * 10) / 10;

        img.data[r] = Math.floor(255 * rate);
        img.data[g] = 0;
        img.data[b] = 0;
        img.data[a] = Math.floor(255 * (1-rate));

        if (index%1000===0) {
            console.error(index+'/'+score.length);
        }
    });

    ctx.putImageData(img, 0, 0);

    ctx.strokeStyle = '#FFF';
    ctx.fillStyle = '#FFF';
    ctx.font = '20px serif';
    ctx.setLineDash([20, 5]);

    for (let i = 100 ; i < width ; i = i + 100) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();

        ctx.fillText(`${i}px`, i + 5, 20);
    }

    for (let i = 100 ; i < width ; i = i + 100) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();

        ctx.fillText(`${i}px`, 5, i + 20);
    }


    return canvas;
})(score, max.width, max.height, maxScore);

const imageBuffer = canvas.toBuffer('image/png');

fs.writeFileSync(path.join(__dirname, '../map.png'), imageBuffer);

