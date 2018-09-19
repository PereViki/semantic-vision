let featureExtractor;
let regressor;
let video;
let loss;
let slider;
let samples = 0;

let position = 0;
let images = []; 
let img1;
let perform = false;

let pg;

function preload() {
  img1 = loadImage('data/full-snapshot.jpg');

  for(let i=0; i<12; i++) {
    images[i] = loadImage('data/' + i + '.jpg');
  }
}

function setup() {
  let c = createCanvas(displayWidth, displayHeight);
  c.position(0,0);

  pg = createGraphics(400,350);

  video = createCapture(VIDEO);
  video.hide();
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  regressor = featureExtractor.regression(video, videoReady);
  setupButtons();
}

function draw() {
  clear();
  image(video, 20, 50, 340, 260);
  noStroke();

  if(!perform) {
    image(img1, 400, 50, 500, 228);
  } else {
    pg.tint(255,80);
    pg.image(images[position], 0,0, 200, 175);
    image(pg, 400,50);
  }
}

function modelReady() {
  select('#modelStatus').html('Model loaded!');
}

function videoReady() {
  select('#videoStatus').html('Video ready!');
}

function predict() {
  regressor.predict(gotResults);
}

function setupButtons() {
  slider = select('#slider');
  select('#addSample').mousePressed(function() {
    regressor.addImage(slider.value());
    select('#amountOfSamples').html(samples++);
  });

  select('#train').mousePressed(function() {
    regressor.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  select('#buttonPredict').mousePressed(predict);
}

// Show the results
function gotResults(err, result) {
  perform = true;
  if (err) {
    console.error(err);
  }
  position = floor(map(result, 0, 1, 0, 11));
  slider.value(result);
  predict();
}
