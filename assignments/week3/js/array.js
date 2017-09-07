var exampleArray = [31,20,5,6,4,21,40,7];
console.log("--array.js------------------------------------------------------------");
console.log(getThreeLargestNumbers(exampleArray));

/**
 * Finds the largest 3 numbers in an array of numbers
 * when the current array value is a number multiple of 3,5, or 3 & 5 respectivelly
 * @param arrayList - array of numbers
 * @return largestNumbers - array with the 3 largest numbers from the given array
 **/
function getThreeLargestNumbers(arrayList) {

  //Validate arrayList, return if the given parameter is not an array
  if (!$.isArray(arrayList) && arrayList.length > 1) {
    console.log("Given parameter should be an array");
    return false;
  }
  //Initialize function variables
  var sortedArray = sortArrayDesc(arrayList);
  if (sortedArray) {
    $.unique(sortedArray); //removing the duplicates, to avoid getting the same number

    var largestNumbers = [sortedArray[0]];
    if (sortedArray.length >= 3) {
      largestNumbers[1] = sortedArray[1];
      largestNumbers[2] = sortedArray[2];
    } else if (sortedArray.length = 2) {
      largestNumbers[1] = sortedArray[1];
    }

    console.log('Three/two largest numbers of array:' + arrayList);
    console.log(largestNumbers);
  }
}

/**
 * Sorts a given array
 * @param arrayList - array of numbers
 * @return sortedArray - the sorted array in descending order
 **/
function sortArrayDesc(arrayList) {


  //Validate arrayList, return if the given parameter is not an array
  if (arrayList.length <= 1) {
    console.log("Given parameter should be an array of length larger than 1");
    return false;
  }

  var temp; //serves to temporary keep the larger element value
  var sortedArray = arrayList;

  for (i = 0; i < sortedArray.length; i++) {

    var k = i; //serves to temporary keep the smaller element index value

    for (j = i + 1; j < sortedArray.length; j++) {
      if (sortedArray[k] < sortedArray[j]) {
        k = j;
      }
    }

    temp = sortedArray[i];
    sortedArray[i] = sortedArray[k];
    sortedArray[k] = temp;

  }
  return sortedArray;
}
