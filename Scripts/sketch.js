
var cnv, soundFile, fft, peakDetect, spectrum;
var ellipseWidth = 10;
const fftSize = 128, soundValues = [0.0, 0.0, 0.0],  soundIsKick = [false, false, false];
const testRatio = 10;
const fftParts = [
  [0, 4 , 0.85],
  [6, 12, 0.60],
  [10, 50, 1]
]

let isBlack = true, logo = [];
var images = [] ,imageRatio = 1, renderImage = [];


function preload(){
  soundFile = loadSound('Assets/HE Sounding 2.m4a');
  for(let i =0; i < 8; i++){
    images[i] = loadImage(`Assets/${i+1}.jpg`);
  }
  logo[0] = loadImage(`Assets/logo1.png`);
  logo[1] = loadImage(`Assets/logo2.png`);

}
function setup() {
  getAudioContext().suspend();
  imageRatio = images[3].width / images[3].height;

  cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  // cnv.mouseClicked(createImage);
  //sound and fft Setup
  fft = new p5.FFT();
  fft.setInput(soundFile);
  spectrum = fft.analyze(fftSize);
  soundFile.amp(0.8);
  // soundFile.loop();
  frameRate(120);

}
 // 3 - 8
function draw() {
  // clear()
  // if(soundFile.isLoaded() && !soundFile.isPlaying()){
  //   soundFile.loop();
  // }

  soundAnalysis();
  rectMode(CENTER)
  var imageWidth = 150;
  if(isBlack){
    background(255 - soundValues[0] * testRatio, 255 - soundValues[0] * testRatio, 255 - soundValues[0] * testRatio)
    fill(soundValues[0] * testRatio, soundValues[0] * testRatio, soundValues[0] * testRatio)
    stroke(soundValues[0] * testRatio);
    image(logo[1], -imageWidth / 2, (-imageWidth / 1.7) / 2, imageWidth, imageWidth / 1.7)
  }
   
  else{
    background(soundValues[0] * testRatio, soundValues[0] * testRatio, soundValues[0] * testRatio)
    fill(255 - soundValues[0] * testRatio, 255 - soundValues[0] * testRatio, 255 - soundValues[0] * testRatio)
    stroke(255 - soundValues[0] * testRatio);
    image(logo[0], -imageWidth / 2, (-imageWidth / 1.7) / 2, imageWidth, imageWidth / 1.7)
  }
  
  renderWave();
  if(soundFile.currentTime() > 6)
    showImages();
  // renderSoundValues();
  // renderSpec();
  
  // console.log(millis());
  // if ( peakDetect.isDetected ) {
  //   ellipseWidth = 600;
  //   console.log('beat')
  // } else {
  //   ellipseWidth *= 1;
  // }
  //let waveform = fft.waveform();
  //noFill();
  // beginShape();
  // stroke(20);
  // for (let i = 0; i < waveform.length; i++){
  //   let x = map(i, 0, waveform.length, 0, width);
  //   let y = map( waveform[i], -1, 1, 0, height);
  //   vertex(x,y);
  // }
  // endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

const soundAnalysis = () => {
  spectrum = fft.analyze(fftSize);
  const len = fftParts.length;
  for(let i = 0; i < len; i++){
    // console.log('i', i)
    let val = 0, c = 0;

    for(let j = fftParts[i][0]; j < fftParts[i][1]; j++){
      // console.log(' j', j)
      val += spectrum[j];
      c ++;
    }
    val = val / c ;
    val = map(val ,0 ,255 ,0 , 1);
    if (val >= fftParts[i][2] && !soundIsKick[i]){
      soundIsKick[i] = true;
      atackNote(i);
    }else if(val < fftParts[i][2]){
      soundIsKick[i] = false;
    }
    soundValues[i] = val;
  }
}
const atackNote = (index) => {
  // console.log(index , " -> kick");
  if(index == 0){
    isBlack = !isBlack;
    // isBlack = true
    // setInterval(()=>{
    //   isBlack=false;
    // }, 300)
  }
  if(index == 1){
    triggerImage();
  }
}

const renderSoundValues = () => {
  const len = soundValues.length;
  for(let i = 0; i < len; i++){
    ellipse((i + 1) * width / (len + 1), height / 3, soundValues[i] * 50 , soundValues[i] * 50);
  }
}

const renderSpec = () => {
  for (let i = 0; i< fftSize; i++){
    let x = map(i, 0,fftSize, 0, width);
    let h = - height / 2+ map(spectrum[i], 0, 255, height / 2, 0);
    rect(x, height, width / fftSize, h )
  }
}
const renderWave = () => {
  // console.log(soundFile.currentTime())
  const waveRes = 40, waveRadius = width < height? width / 4 : height / 4, circleCount = 10;
  push()
  // rotateZ(millis() / 4000 )
  for(let j=0; j < circleCount; j++){
    const w = map(j, 0, circleCount, 2, 0);
    
    noFill();
    strokeWeight(w);
    beginShape();
    for (let i = 0; i < waveRes; i++){
      const t = map(i, 0, waveRes, 0, 2 * Math.PI) + j / 2 +  soundValues[2] * 10;
      const n = noise(soundFile.currentTime() / 1 + i / 20 + soundValues[1] * 2) * 85;
      const x = (waveRadius + n + j * 20) * Math.cos(t);
      const y =  (waveRadius + n - j * 20) * Math.sin(t);
      vertex(x,y);
    }
    // curveVertex(x0,y0);
    endShape(CLOSE);
    strokeWeight(0);
  }
  pop()
}
const createImage = () => {
  // if (soundFile.isPlaying()) {
  //   soundFile.pause();
  // } else {
  //   soundFile.loop();
  // }
  if(!soundFile.isPlaying()){
    soundFile.loop();
  }
  // triggerImage();
}
function mousePressed() {
  userStartAudio();
  if(!soundFile.isPlaying()){
    soundFile.loop();
  }
}

const addImage = (index, dur, x, y, size, xDomain, yDomain) => {
  var img = {time: millis(),duration: dur,index ,x ,y ,size ,xDomain, yDomain}
  renderImage.push(img);
}

const showImages = () => {
  renderImage = renderImage.filter(function(ele){ 
    return (millis() - ele.time) < ele.duration; 
  });
  renderImage.forEach(img => {
    image(images[img.index],img.x ,img.y , img.size, img.size / imageRatio, img.xDomain, img.yDomain);
  });
}
const triggerImage = () => {
  var imageSize = map(Math.random(), 0, 1, 100, width / 3)
  var index = Math.floor(Math.random() * images.length)
  var w0 = map(Math.random(), 0, 1, 0, imageSize / 2)
  var w1 = map(Math.random(), 0, 1, imageSize / 2, imageSize)
  var h0 = map(Math.random(), 0, 1, 0, imageSize / 2)
  var h1 = map(Math.random(), 0, 1, imageSize / 2, imageSize)
  var xDomain = [w0, w1]
  var yDomain = [h0, h1]
  var x = map(Math.random(), 0, 1, (-width + w1 + w0) / 2, (width - w1 - w0) / 2)
  var y = map(Math.random(), 0, 1, (-height+ h1 + h0) / 2, (height- h1 - h0) / 2)
  // renderImage
  
  addImage(index, 200 ,x ,y , imageSize, xDomain[0], yDomain[0], xDomain[1], yDomain[1]);
}