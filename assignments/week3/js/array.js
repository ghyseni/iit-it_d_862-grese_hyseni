/**
 * Page main js functionality
 * @param
 * @return
 **/
var main = function() {

  //Call fizzBuzz on button click
  $('.show-result').on('click', function() {

    var $p = $('<p>');

    $('.result').html('');
    var inputText = $('input.array').val();

    //gerente an array by spliting the input value
    var arrayList = inputText.split(',');
    var invalidInput = false;
    var $p = $('<p>');

    //Validate input value
    if (arrayList.length < 2) { //check if array length is 2
      invalidInput = true;
    }
    //convert number characters to integer
    $.each(arrayList, function(index, value) {
      arrayList[index]=parseInt(value);
      if (!$.isNumeric(value)) {
        invalidInput = true;
      }
    });

    if (invalidInput) {
      alert("Input text is not valid. The correct format is: n1,n2,..,nn - where n1, n2,...,nn are numbers");
    } else {
      $p.text(max(arrayList));
      $('.result').html($p);
    }

  });

  //Trigger button click on enter press
  $("input.array").on("keypress", function(event) {
    if (event.keyCode === 13) {
      $('.show-result')[0].click();
    }
  });

}

$(document).ready(main);

/**
 * Finds the largest 3 numbers in an array of numbers
 * when the current array value is a number multiple of 3,5, or 3 & 5 respectivelly
 * @param arrayList - array of numbers
 * @return largestNumbers - array with the 3 largest numbers from the given array
 **/
function max(arrayList) {

  //Validate arrayList, return if the given parameter is not an array
  if (!$.isArray(arrayList) && arrayList.length > 1) {
    return "Given parameter should be an array";
  }
  //Initialize function variables
  var sortedArray = sortArrayDesc(arrayList);

  if (sortedArray) {
    $.unique(sortedArray); //removing the duplicates, to avoid getting the same number

    var largestNumbers = [sortedArray[0]];
    if (sortedArray.length == 2) {
      largestNumbers[1] = sortedArray[1];
    } else if (sortedArray.length > 2) {
      largestNumbers[1] = sortedArray[1];
      largestNumbers[2] = sortedArray[2];
    }
  }
  return largestNumbers;
}

/**
 * Sorts a given array
 * @param arrayList - array of numbers
 * @return sortedArray - the sorted array in descending order
 **/
function sortArrayDesc(arrayList) {
  //Validate arrayList, return if the given parameter is not an array
  if (arrayList.length <= 1) {
    return "Given parameter should be an array of length larger than 1";
  }

  var temp; //serves to temporary keep the larger element value
  var sortedArray = arrayList;

  for (i = 0; i < sortedArray.length; i++) {

    var k = i; //serves to temporary keep the smaller element index value

    for (j = i + 1; j < sortedArray.length; j++) {
      if (sortedArray[j] > sortedArray[k]) {
        k = j;
      }
    }

    temp = sortedArray[i];
    sortedArray[i] = sortedArray[k];
    sortedArray[k] = temp;

  }

  return sortedArray;
}
