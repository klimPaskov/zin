// Review aid: contact sheet of staged DDS sprites (uncompressed BGRA written by lib/raster.mjs).
//   node tools/content/preview.mjs <dirWithDds> <out.png> [nameFilter]
import sharp from 'sharp';import {readFile,readdir} from 'node:fs/promises';import path from 'node:path';
const [dir,out,filter='']=process.argv.slice(2);const files=(await readdir(dir)).filter(f=>f.endsWith('.dds')&&f.includes(filter)).sort();
const tiles=[];for(const f of files){const b=await readFile(path.join(dir,f));const h=b.readUInt32LE(12),w=b.readUInt32LE(16),px=Buffer.from(b.subarray(128));for(let i=0;i<px.length;i+=4){const t=px[i];px[i]=px[i+2];px[i+2]=t;}tiles.push({w,h,png:await sharp(px,{raw:{width:w,height:h,channels:4}}).png().toBuffer()});}
const cols=Math.min(16,tiles.length),tw=Math.max(...tiles.map(t=>t.w))+4,th=Math.max(...tiles.map(t=>t.h))+4,rows=Math.ceil(tiles.length/cols);
await sharp({create:{width:cols*tw,height:rows*th,channels:4,background:'#444'}}).composite(tiles.map((t,i)=>({input:t.png,left:(i%cols)*tw+2,top:Math.floor(i/cols)*th+2}))).png().toFile(out);console.log(files.length);
