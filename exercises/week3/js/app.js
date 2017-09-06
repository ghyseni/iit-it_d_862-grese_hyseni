var main = function() {
  "use strict";
  // window.alert("hello world");

  $(".comment-input button").on("click", function() {
    console.log("Hello world");
    var $newP = $("<p>Added comment</p>");
    $('.comments').append($newP);
  });
}

$(document).ready(main);
