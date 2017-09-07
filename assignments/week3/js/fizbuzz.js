/*
    Write a function called fizzBuzz which given a range of numbers (i.e. fizzBuzz(1,100), but should accept any range) iterates over them and prints something for each item
        If number is multiple of 3, then print Fizz
        If number is multiple of 5, then print Buzz
        If number is multiple of 3 & 5, then print FizzBuzz
        If number does not satisfy any of the above, print the number
    GRAD REQUIREMENT: Handle edge cases (i.e. start > end) and throw descriptive exception
    GRAD REQUIREMENT: No code duplication – DRY

*/

fizzBuzz(1, 30);

/**
 * Iterates in the given array and prints Fizz, Buzz or FizzBuzz
 * when the current array value is a number multiple of 3,5, or 3 & 5 respectivelly
 * @param rangeStart the start of the range of integers i.e. 1
 * @param rangeEnd the start of the range of integers i.e. 100
 * @return
 **/
function fizzBuzz(rangeStart, rangeEnd) {

  //Validate ranges - Check if array's last number in the array
  if (rangeEnd < rangeStart) {
    console.log("Second parameter's value should be an integer bigger than the first parameter integer");
    return;
  }

  for (i = rangeStart; i <= rangeEnd; i++) {

    if (i % 3 == 0) {
      if (i % 5 != 0) {
        console.log("Fizz");
      } else {
        console.log("FizzBuzz");
      }
    } else if (i % 5 == 0) {
      console.log("Buzz");
    }

  }

}
