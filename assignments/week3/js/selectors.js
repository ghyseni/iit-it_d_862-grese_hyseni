/**
* Page main js functionality
* @param
* @return
**/
var main = function() {

  var usedColors = [];
  var randColor;

  $(".relevant p").each(function() {
    var thisEl = this;
    window.setTimeout(function() {
      randColor = generateNewRandomColor(usedColors);
      $(thisEl).css("color", randColor);
      $(thisEl).fadeIn();
    }, 500);
  });
} 

//Hide parapraph elements before document ready
$(".relevant p").hide();

$(document).ready(main);

/**
* Generates a random color
* @param usedColors array of colors
* @return Returns a random color in rgb format
**/
var generateNewRandomColor = function(usedColors) {
  var randColor;
  var colorR = Math.floor((Math.random() * 256));
  var colorG = Math.floor((Math.random() * 256));
  var colorB = Math.floor((Math.random() * 256));
  randColor = "rgb(" + colorR + ", " + colorG + ", " + colorB + ")";

  //Check if random color generated has been used before, if so generate again
  if ($.inArray(randColor, usedColors) > -1) {
    generateNewRandomColor(usedColors);
  }

  return randColor;
}
