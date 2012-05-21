dropzone = $('#drop_zone')[0];
unshreddedImage = $('#unshreddedImage')[0];
ctx = $('#unshreddedImage')[0].getContext("2d");
width = $('#unshreddedImage').width();
height = $('#unshreddedImage').height();

dropzone.ondragover = function () { 
	this.className = 'hover';
	return false;
};

dropzone.ondragenter = function () { 
	this.className = 'hover'; 
	return false;
};

dropzone.ondragleave = function () {
	this.className = ''; 
	return false;
};

dropzone.ondrop = function (e) {
  e.preventDefault();

  var file = e.dataTransfer.files[0], reader = new FileReader();

  reader.onload = function (event) {
    console.log(event.target);
    var img = new Image;
    img.onload = function(){
      ctx.drawImage(img,0,0);
    };
    img.src = event.target.result;
    $('canvas').css('display', 'block');
    $('#drop_zone').css('display', 'none');
    $('#buttons').css('display', 'block');
  };

  console.log(file);
  reader.readAsDataURL(file);

  return false;
};

function unshred() {

}