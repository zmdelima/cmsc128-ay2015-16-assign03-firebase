'use strict';

var database = new Firebase('https://buwmu8r5chg.firebaseio-demo.com/');

$(document).ready(function () {
    var note_buttons = $(#note_table_body);
    var note_content = $(#note_content_text);
    var add_note     = $();







});

$('#messageInput').keypress(function (e) {
    if (e.keyCode == 13) {
      var name = $('#nameInput').val();
      var text = $('#messageInput').val();
      database.push({name: name, text: text});
      $('#messageInput').val('');
    }
});

myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
});

function displayChatMessage(name, text) {
    $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};
