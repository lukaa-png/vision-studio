import { ghostFrame } from '../../mascot/official/renderer.mjs';

const canvas = document.querySelector('#film-canvas');
const c = canvas.getContext('2d', {alpha:false});
const W = 1920, H = 1080;
const ink = '#080D18', fog = '#E8F1F5', pulse = '#B5F45B', cyan = '#8EDDD8';
const beats = [0,2.8125,7.5,12.1875,16.875,24];
const assets = new URL('../../../assets/', import.meta.url).href;
const shots = [
  {name:'ALLYAH BRAIDS', url:'allyah-braids.pages.dev', project:'01 / BELEZA', copy:['Agendar sem','complicar.'], detail:['Galeria de tranças e pedido','de horário pelo WhatsApp.'], bg:'#EDE5D9', rule:'#C9B6A5', fg:'#2D1A15', accent:'#9E502F', x:646, detailAt:2.54, call:'FORMULÁRIO DE AGENDAMENTO', files:['allyah-web.jpg','allyah-agendamento.jpg']},
  {name:'SOLUÇÃO PROTECT', url:'PRÉVIA DO PROJETO', project:'02 / SERVIÇOS', copy:['Serviços','bem claros.'], detail:['Proteção residencial com','pedido de orçamento.'], bg:'#E1EBF7', rule:'#AABDD7', fg:'#071D45', accent:'#2558D8', x:74, detailAt:2.04, call:'ORÇAMENTO PELO WHATSAPP', files:['solucao-protect-web.jpg','solucao-protect-servicos.jpg']},
  {name:'ATELIÊ 27', url:'barbearia-9lz.pages.dev', project:'03 / BARBEARIA', copy:['Do corte','ao horário.'], detail:['Serviços e fluxo de pedido','de horário demonstrativo.'], bg:'#191D21', rule:'#3A4146', fg:fog, accent:pulse, x:646, detailAt:2.57, call:'PEDIDO DE HORÁRIO / DEMO', files:['atelie-27-web.jpg','atelie-27-agendamento.jpg']},
];
const loadImage = async src => {
  const img = new Image();
  img.src = assets + src;
  await img.decode();
  return img;
};
await Promise.all([document.fonts.load('700 72px Space'),document.fonts.load('400 32px Space'),document.fonts.load('400 22px Plex')]);
await Promise.all(shots.map(async shot=>{shot.images=await Promise.all(shot.files.map(loadImage));}));

const sat = a => Math.max(0,Math.min(1,a));
const mix = (a,b,t) => a+(b-a)*t;
const ease = a => { const t=sat(a); return t*t*(3-2*t); };
const arrive = a => 1-Math.pow(1-sat(a),3);
function box(x,y,w,h,color,r=0) {
  c.fillStyle=color;
  if (r) {c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
  else c.fillRect(x,y,w,h);
}
function outline(x,y,w,h,color,r=0,width=1) {
  c.beginPath();c.roundRect(x,y,w,h,r);c.strokeStyle=color;c.lineWidth=width;c.stroke();
}
function text(s,x,y,size,color,style='bold',align='left') {
  c.font=style==='mono'? size+'px Plex' : (style==='bold'?'700 ':'400 ')+size+'px Space';
  c.textAlign=align;c.textBaseline='top';c.fillStyle=color;c.fillText(s,x,y);
}
function line(x1,y1,x2,y2,color,width=1) {
  c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.stroke();
}
function reveal(s,x,y,size,color,t,style='bold') {
  const progress=arrive(t/.47);
  if (!progress) return;
  c.save();
  c.beginPath();c.rect(0,y-5,W,size*1.38+5);c.clip();
  text(s,x,y+(1-progress)*(size+14),size,color,style);
  c.restore();
}
function brand(x,y,color,size=36) {
  const q=size*.66;
  const part=q*.22;
  for(const [a,b] of [[0,0],[1,0],[0,1],[1,1]]){
    line(x+a*q,y+b*q,x+a*q+(a?-part:part),y+b*q,color,2.7);
    line(x+a*q,y+b*q,x+a*q,y+b*q+(b?-part:part),color,2.7);
  }
  line(x+q*.31,y+q*.36,x+q*.50,y+q*.70,color,2.9);
  line(x+q*.50,y+q*.70,x+q*.69,y+q*.36,color,2.9);
  text('vision',x+q+15,y-7,size,color);
}
function grid(color, alpha, step=64) {
  c.save(); c.globalAlpha=alpha;
  for(let x=70;x<W-70;x+=step) line(x,142,x,H-87,color);
  for(let y=142;y<H-87;y+=step) line(70,y,W-70,y,color);
  c.restore();
}
function arcField(x,y,t,color) {
  for(let i=0;i<4;i++){
    c.save();c.translate(x,y);c.rotate(-.39+t*.065+i*.18);
    c.globalAlpha=.21-i*.034;c.strokeStyle=color;c.lineWidth=1.5;
    c.beginPath();c.ellipse(0,0,272+i*41,205+i*21,0,-2.92+i*.44,2.10+i*.26);c.stroke();
    const a=t*.63+i*1.42;
    box(Math.cos(a)*(272+i*41)-3,Math.sin(a)*(205+i*21)-3,6,6,color,3);
    c.restore();
  }
}
function header(fg,rule,label,tag) {
  brand(76,58,fg,41);
  text(label,300,65,19,fg,'mono');
  text(tag,1844,65,19,fg,'mono','right');
  line(76,119,1844,119,rule);
}
function footer(fg,rule,label,t) {
  line(76,975,1844,975,rule);
  text(label,76,1002,17,fg,'mono');
  text('VISION / DESIGN + CODE',1844,1002,17,fg,'mono','right');
  box(76,972,(1768)*sat(t/24),4,fg);
}
function intro(t) {
  box(0,0,W,H,ink);
  const g=c.createRadialGradient(1460,534,75,1460,534,690);
  g.addColorStop(0,'#1C3540');g.addColorStop(1,ink);
  box(720,125,1200,850,g);
  grid(cyan,.115);
  arcField(1450,545,t,cyan);
  header(fog,'#314151','COMERCIAL / LANDING PAGES','01—03 / PROJETOS');
  text('DO OLHAR À CONSTRUÇÃO',80,205,23,cyan,'mono');
  ['Seu negócio','merece um','site à altura.'].forEach((s,i)=>reveal(s,70,267+i*136,133,i===2?pulse:fog,t-.13-i*.13));
  const p=arrive((t-.64)/.47);
  box(80,728,106*p,5,pulse);
  reveal('Design e código para negócios reais.',80,770,39,fog,t-.66,'normal');
  text('FIG. 01 / MASCOTE VISION',1460,878,18,cyan,'mono','center');
  footer(fog,'#314151','VISION STUDIO  /  PORTFÓLIO WEB',t);
}

function drawBrowser(s,t,x,y,w) {
  const h=w*800/1280;
  const frameTop=42;
  c.save();c.shadowColor='#080d1833';c.shadowBlur=32;c.shadowOffsetY=16;
  box(x,y,w,h+frameTop,'#FFFFFF',14);c.restore();
  c.save();c.beginPath();c.roundRect(x,y,w,h+frameTop,14);c.clip();
  box(x,y,w,frameTop,s.fg===fog?'#30363B':'#F6F8FA');
  for(let i=0;i<3;i++) box(x+20+i*13,y+18,6,6,s.accent,3);
  text(s.url,x+w/2,y+13,14,s.fg,'mono','center');
  c.save();c.beginPath();c.rect(x,y+frameTop,w,h);c.clip();
  const zoom=1+Math.min(t,2.4)*.016;
  c.drawImage(s.images[0],x-(zoom-1)*w*.53,y+frameTop-(zoom-1)*h*.46,w*zoom,h*zoom);
  const revealDetail=ease((t-s.detailAt)/.55);
  if (revealDetail>0) {
    c.save();
    if(s===shots[0]){
      box(x,y+frameTop,w,h,'rgba(37,23,16,'+.25*revealDetail+')');
      const thumbH=h*.89,thumbW=thumbH*s.images[1].naturalWidth/s.images[1].naturalHeight;
      const xx=x+w*.44+(1-revealDetail)*w*.66;
      const yy=y+frameTop+h*.052;
      c.shadowColor='#2D1A1566';c.shadowBlur=28;c.shadowOffsetY=10;
      box(xx-9,yy-9,thumbW+18,thumbH+18,'#fff',12);
      c.shadowBlur=0;c.shadowOffsetY=0;
      c.drawImage(s.images[1],xx,yy,thumbW,thumbH);
    }else{
      c.beginPath();c.rect(x,y+frameTop+h*(1-revealDetail),w,h*revealDetail);c.clip();
      c.drawImage(s.images[1],x,y+frameTop,w,h);
      if(revealDetail<.995) box(x,y+frameTop+h*(1-revealDetail)-3,w,4,pulse);
    }
    c.restore();
  }
  c.restore();c.restore();
  outline(x,y,w,h+frameTop,'#080D1830',14,1.5);
}
function project(s,t,global) {
  box(0,0,W,H,s.bg);
  grid(s.rule,.29);
  header(s.fg,s.rule,s.name,s.project);
  const x=s===shots[1]?1286:75;
  text('LANDING PAGE',x,248,22,s.accent,'mono');
  s.copy.forEach((word,i)=>reveal(word,x-4,301+i*91,87,s.fg,t-.04-i*.09));
  s.detail.forEach((word,i)=>reveal(word,x,525+i*43,34,s.fg,t-.3-i*.05,'normal'));
  const browserX=s.x+(s===shots[1]?-1:1)*(1-arrive(t/.62))*75;
  drawBrowser(s,t,browserX,176,s===shots[1]?1152:1195);
  const labelProgress=arrive((t-s.detailAt-.14)/.45);
  if(labelProgress){
    c.save();c.beginPath();c.rect(s.x,918,650*labelProgress,46);c.clip();
    box(s.x,919,650,41,s.fg,4);
    text(s.call,s.x+17,930,17,s.bg,'mono');
    c.restore();
  }
  footer(s.fg,s.rule,s.project+'  /  DESIGN + DESENVOLVIMENTO',global);
}
function outro(t,global) {
  box(0,0,W,H,ink);
  grid(cyan,.135);
  const g=c.createRadialGradient(1490,550,40,1490,550,570);
  g.addColorStop(0,'#6EB44A3A');g.addColorStop(1,'#080D1800');
  box(890,145,960,790,g);
  arcField(1460,550,t,pulse);
  header(fog,'#314151','VISION / ESTÚDIO INDEPENDENTE','DESIGN + CODE');
  text('SEU SITE, DA IDEIA À PUBLICAÇÃO',76,210,24,cyan,'mono');
  reveal('Sua landing page',71,280,111,fog,t-.05);
  reveal('por R$ 500.',71,407,135,pulse,t-.19);
  reveal('Estrutura, design, desenvolvimento e publicação.',76,579,38,fog,t-.47,'normal');
  const k=arrive((t-.79)/.50);
  if(k){
    c.save();c.beginPath();c.rect(76,682,752*k,98);c.clip();
    box(76,682,752,98,pulse,4);
    text('Fale com a Vision',107,705,45,ink);
    text('↗',783,701,45,ink,'normal','right');
    c.restore();
  }
  reveal('vision-ckp.pages.dev',76,812,32,cyan,t-.92,'mono');
  footer(fog,'#314151','LUIZ ALBUQUERQUE / VISION',global);
}
const cue=[
  [0,1470,588,670,-.44,-.19,0],[.7,1460,534,684,.20,.09,.68],[1.7,1430,540,668,-.12,.11,.18],
  [2.35,1328,555,654,-.43,.16,-.35],[2.91,620,686,480,-.44,.26,0],
  [3.57,428,801,430,.31,-.12,.12],[4.68,486,778,448,.46,-.12,.52],
  [5.35,614,764,420,.50,-.13,.98],[5.71,580,790,410,.24,-.08,.50],
  [7.04,540,814,418,.14,-.10,.18],[7.76,1323,746,480,.48,-.27,0],
  [8.32,1499,777,440,-.29,.09,-.28],[9.65,1440,785,432,-.39,.12,-.44],
  [10.10,1315,754,419,-.43,.12,-.98],[10.45,1338,775,421,-.20,.09,-.52],
  [11.72,1450,809,420,-.06,.11,-.16],[12.42,635,767,465,-.46,.26,0],
  [13.04,450,789,435,.24,-.14,.18],[14.37,491,799,430,.32,-.09,.42],
  [14.77,624,758,427,.41,-.13,1],[15.15,557,791,422,.16,-.08,.42],
  [16.41,580,810,433,.12,-.11,.21],[17.08,1420,588,634,.44,-.22,0],
  [17.86,1494,550,664,-.17,.12,-.45],[18.37,1310,614,633,-.38,.18,-.95],
  [19.03,1478,558,665,.22,-.06,-.12],[21.02,1477,548,664,-.11,.08,.41],[23.98,1466,541,670,.14,-.02,.48],
];
function pose(t) {
  const i=cue.findIndex(frame=>frame[0]>t);
  const a=cue[i<0?cue.length-1:i-1], b=cue[i<0?cue.length-1:i];
  const k=a===b?0:ease((t-a[0])/(b[0]-a[0]));
  const values=a.slice(1).map((v,j)=>mix(v,b[j+1],k));
  values[1]+=Math.sin(t*5.3)*13;
  return values;
}
function ping(x,y,t,shade,scale=1) {
  if(t<0 || t>.75)return;
  for(let i=0;i<2;i++){
    const a=sat(t/.75-i*.14);
    c.save();c.globalAlpha=(1-a)*.8;c.strokeStyle=shade;c.lineWidth=3;
    c.beginPath();c.arc(x,y,(12+arrive(a)*62)*scale,0,Math.PI*2);c.stroke();
    c.restore();
  }
}
const taps=[
  [5.35,844,756,'#9E502F',1],[10.10,1010,808,'#2558D8',-1],
  [14.77,742,753,pulse,1],[18.37,793,731,pulse,-1],
];
function links(t, p) {
  const [x,y]=p;
  for(const [at,tx,ty,color,d] of taps) {
    if (Math.abs(t-at)>.34)continue;
    const f=(1-Math.abs(t-at)/.34)*.88;
    c.save();c.globalAlpha=f;
    c.setLineDash([7,11]);line(x+d*140,y+13,tx,ty,color,2.5);c.setLineDash([]);
    c.restore();
  }
  for(const [at,tx,ty,color] of taps)ping(tx,ty,t-at,color);
}
function mascot(t) {
  const p=pose(t);
  const [x,y,size,yaw,roll,reach]=p;
  for(const cut of beats.slice(1,-1)) {
    if(Math.abs(t-cut+.07)>.48)continue;
    c.save();
    for(let i=16;i>0;i--){
      const prev=pose(Math.max(0,t-i*.016));
      c.globalAlpha=(17-i)/32;
      box(prev[0]-3,prev[1]+30+i*1.4,8-i*.23,8-i*.23,i%3?cyan:pulse,5);
    }
    c.restore();
  }
  c.save();
  // The shadow is stretched independently of the floating body.
  c.translate(x,y+size*.30);c.scale(size*.28,size*.065);
  const shadow=c.createRadialGradient(0,0,0,0,0,1);
  shadow.addColorStop(0,'#080D1850');shadow.addColorStop(1,'#080D1800');
  box(-1,-1,2,2,shadow);c.restore();
  links(t,p);
  const wink=Math.pow(Math.max(0,1-Math.abs(t-20.06)*7),2);
  const ghost=ghostFrame(t,yaw,roll,reach,wink);
  c.drawImage(ghost,x-size/2,y-size/2,size,size);
}
function stage(index,t) {
  const elapsed=t-beats[index];
  if(index===0)intro(elapsed);
  else if(index===4)outro(elapsed,t);
  else project(shots[index-1],elapsed,t);
}
function frame(t) {
  let index=beats.findIndex(start=>start>t)-1;
  if(index<0)index=4;
  const elapsed=t-beats[index];
  const transition=index>0&&elapsed<.37;
  if(transition){
    stage(index-1,t);
    const p=ease(elapsed/.37);
    const left=index%2?W*(1-p)-105:-100;
    const right=index%2?W+100:W*p+100;
    c.save();c.beginPath();
    c.moveTo(left+135,0);c.lineTo(right+135,0);c.lineTo(right-135,H);c.lineTo(left-135,H);c.closePath();c.clip();
    stage(index,t);c.restore();
    const x=index%2?left:right;
    if(p>.04&&p<.97)line(x+135,0,x-135,H,pulse,6);
  }else stage(index,t);
  mascot(t);
}
window.film = {canvas,frame,duration:24};
frame(0);





if (new URLSearchParams(location.search).has('play')) {
  let start;
  function play(now) {
    start ??= now;
    frame(((now - start) / 1000) % window.film.duration);
    requestAnimationFrame(play);
  }
  requestAnimationFrame(play);
}
