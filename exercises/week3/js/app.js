var main = function() {
  "use strict";
  // window.alert("hello world");

  //Add click event listener to add text from comment input to comments section
  $(".comment-input button").on("click", function() {
    addCommentFromInputBox();
  });

  //Submit new comment add in Enter key press
  $(".comment-input input").on("keypress", function(event) {
    if (event.keyCode === 13) {
      addCommentFromInputBox();
    }
  });

  var addCommentFromInputBox = function() {
    var $new_comment = $("<p>"),
      $comment_text = $(".comment-input input");
    if ($comment_text.val() !== "") {
      $new_comment.text($comment_text.val());
        $new_comment.hide();
      $('.comments').append($new_comment);
      $new_comment.fadeIn();

      $comment_text.val("");
    }

  }
}



$(document).ready(main);
