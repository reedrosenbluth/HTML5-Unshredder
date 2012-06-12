var $dropzone = $('#drop_zone')[0];
var $unshreddedImage = $('#unshreddedImage')[0];
var ctx = $unshreddedImage.getContext("2d");
var $width = $('#unshreddedImage').width();
var $height = $('#unshreddedImage').height();
var currentWidth = 0;
var strips = [];
var sequence = [];


$dropzone.ondragover = function () {
  this.className = 'hover';
  return false;
};

$dropzone.ondragenter = function () {
  this.className = 'hover';
  return false;
};

$dropzone.ondragleave = function () {
  this.className = '';
  return false;
};

$dropzone.ondrop = function (e) {
  e.preventDefault();

  var file = e.dataTransfer.files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    console.log(event.target);
    var img = new Image;
    img.onload = function() {
      ctx.drawImage(img,0,0);
    };
    img.src = event.target.result;
    $('canvas').show();
    $('#drop_zone').hide();
    $('#buttons').show();
  };

  reader.readAsDataURL(file);

  return false;
};


function rgbToHue (r, g, b) {
  if (r == b && g == b) {
    return 0;
  }
  return ((180 / Math.PI * Math.atan2((2 * r) - g - b, Math.sqrt(3) * (g - b))) - 90) % 360;
}

function pixelMap(x, y, w) {
  var r = x * 4 + y * w * 4;
  var g = x * 4 + y * w * 4 + 1;
  var b = x * 4 + y * w * 4 + 2;
  return [r,g,b];
}

function stripDistance(s, t) {
  var distances = 0;
  for (i = 0; i < 359; i++) {
    var pixelR = pixelMap(31, i, 32);
    var pixelL = pixelMap(0, i, 32);
    var hue_pixelR = rgbToHue(s.data[pixelR[0]], s.data[pixelR[1]], s.data[pixelR[2]]);
    var hue_pixelL = rgbToHue(t.data[pixelL[0]], t.data[pixelL[1]], t.data[pixelL[2]]);
    var distance =  Math.min((hue_pixelR - hue_pixelL + 360) % 360, (hue_pixelL - hue_pixelR + 360) % 360);
    distances += distance;
  }
  return distances;
}

function unshred() {
  for (i = 0; i < 20; i++) {
    var imageData = ctx.getImageData(i*32, 0, 32, 359);
    strips.push(imageData);
  }
  ctx.clearRect(0, 0, $width, $height);

  sequence.push(strips[0]);
  strips.splice(0, 1);

  for (k = 0; k < 19; k++) {
    var distancesR = [];
    var distancesL = [];
    for (j = 0; j < (19 - k); j++) {
      distancesR.push(stripDistance(sequence[k], strips[j]));
      distancesL.push(stripDistance(strips[j], sequence[0]));
    }
    indexR = distancesR.indexOf(Math.min.apply(Math, distancesR));
    indexL = distancesL.indexOf(Math.min.apply(Math, distancesL));

    if (Math.min.apply(Math, distancesR) < (Math.min.apply(Math, distancesL))) {
      sequence.push(strips[indexR]);
      strips.splice(indexR, 1);
    }
    else {
      sequence.unshift(strips[indexL]);
      strips.splice(indexL, 1);
    }
  }

  for (i = 0; i < 20; i++) {
    ctx.putImageData(sequence[i], i*32, 0);
  }
  $('#buttons').hide();
}


$('#startbutton').on('click', unshred);














