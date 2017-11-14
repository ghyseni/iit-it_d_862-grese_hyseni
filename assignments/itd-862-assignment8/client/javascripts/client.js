var main = function() {
  "use strict";

  $(document).on('click', '.add-user', function(e) {

    var formData = objectifyForm($(this).closest('form'));
    if (formData.name !== "" && formData.email !== "") {
      e.preventDefault();
      addUser(formData);
    }
  });
  $(document).on('click', '.delete-user', function(e) {
    e.preventDefault();
    var userId = $(this).closest(".item").data("id");
    removeUser(userId);
  });
  $(document).on('click', '.add-reminder', function(e) {
    var formData = objectifyForm($(this).closest('form'));
    console.log(formData);
    if (formData.title !== "") {
      e.preventDefault();
      addReminder(formData);
    }
  });

  $(document).on('click', '.delete-reminder', function(e) {
    e.preventDefault();
    var reminderId = $(this).closest(".item").data("id");
    var userId = $(this).closest(".items").data("userid");
    removeReminder(userId, reminderId);
  });
  $(document).on('click', '.delete-reminders', function(e) {
    e.preventDefault();
    var userId = $(this).closest(".items").data("userid");
    removeReminders(userId);
  });
}

function addUser(user) {
  console.log(user);
  $.ajax({
    url: "/users/",
    type: "POST",
    data: JSON.stringify(user),
    contentType: "application/json",
    success: function(newUser, status) {
      $('.items').append('<tr id="item-' + newUser._id + '" class="item" data-id="' + newUser._id + '"><td>' + newUser.name + '</td>' +
        '<td>' + newUser.email + '</td>' +
        '<td><a href="users/' + newUser._id + '" class="btn btn-primary">View</a>' +
        '<button class="btn btn-secondary delete-user ml-2">Delete</button> </td></tr>');
      $('.items .not-found').remove();
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function removeUser(userId) {
  console.log(userId);
  $.ajax({
    url: '/users/' + userId,
    type: 'DELETE',
    success: function(result) {
      $('#item-' + userId).remove();
    }
  });
}

function addReminder(reminder) {
  console.log(reminder);
  $.ajax({
    url: "/users/" + reminder.userId + "/reminders/",
    type: "POST",
    data: JSON.stringify(reminder),
    contentType: "application/json",
    success: function(newReminder, status) {
      $('.items').append('<tr id="item-' + newReminder._id + '" class="item" data-id="' + newReminder._id + '"><td>' + newReminder.title + '</td>' +
        '<td>' + newReminder.description + '</td>' +
        '<td><a href="reminders/' + newReminder._id + '" class="btn btn-primary">View</a>' +
        '<button class="btn btn-secondary delete-reminder ml-2">Delete</button> </td></tr>');

      $('.items .not-found').remove();
    }
  });
}

function removeReminder(userId, reminderId) {
  $.ajax({
    url: '/users/' + userId + '/reminders/' + reminderId,
    type: 'DELETE',
    success: function(result) {
      $('#item-' + reminderId).remove();
    }
  });
}

function removeReminders(userId, reminderId) {
  $.ajax({
    url: '/users/' + userId + '/reminders/',
    type: 'DELETE',
    success: function(result) {
      $('.item').remove();
      $('.items').append('<tr class="not-found"><td colspan="3">No reminders found</td></tr>');
    }
  });
}

function objectifyForm($form) { //serialize data function
  var formData = $form.serializeArray();
  var returnArray = {};
  for (var i = 0; i < formData.length; i++) {
    returnArray[formData[i]['name']] = formData[i]['value'];
  }
  return returnArray;
}

$(document).ready(main);
