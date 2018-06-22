var app = {
  roomName: undefined,
  friends: {},
  server: 'http://parse.sfm6.hackreactor.com',
  init: function() {
    app.username = window.location.search.substr(10);
    app.$main = $('#main');
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');
    app.$main.on('click', '.username', app.handleUsernameClick);
    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.roomChange);
    app.fetch(app.roomName);
    setInterval(function() { app.fetch(app.roomName); }, 1000);
  },
  send: function(message) {
    $.ajax({
      url: 'http://parse.sfm6.hackreactor.com',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent');
        app.renderMessage(data);
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  fetch: function() {
    $.ajax({
      url: 'http://parse.sfm6.hackreactor.com',
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message received');
        app.renderMessage(data);
      },
      error: function(data) {
        console.error('chatterbox: Failed to receive message');
      }
    });
  },

  clearMessages: function() {
    $('#chats').html('');
  },


  renderMessage: function(message) {
    $('.post').remove();
    var {username, text, roomname} = message;
    var element = $('<div class=' + (username === undefined || username.includes('<') || username.includes('$') ? 'anonymous' : username.split(" ").join()) + '>');
    element.text(username + ' [' + roomname + '] : ' + text + '</div>');
    $('#chats').append(element);
  },    


  renderRoom: function(room) {
    if (room !== undefined && room !== '') {
      $('#roomSelect').append('<option value=' + room + '>' + room + '</option>');
    }
  }, 

  handleSubmit: function() {
    $('#sendButton').on('click', function() {
      var message = {};
      message.username = window.location.search.slice(10);
      message.text = $('#messageInput').val();
      message.roomname = app.roomName;
      app.send(message);            
    });
  },  

  handleUsernameClick: function(evt) {
    var username = $(evt.currentTarget).attr('data-username');
    if (username !== undefined) {
      console.log('chatterbox: Adding %s as a friend', username);
      app.friends[username] = true;
      var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
      var $usernames = $(selector).addClass('friend');
    }
  }  
};