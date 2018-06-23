/*var app = {
  roomName: undefined,
  friends: {},
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  init: function() {
    app.username = window.location.search.substr(10);
    app.$main = $('#main');
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');
    app.$main.on('click', '.username', app.handleUsernameClick);
    app.handleSubmit();
    //app.renderRoom();
    //app.$roomSelect.on('change', app.roomChange);
    app.fetch(app.roomName);
    //setInterval(function() { app.fetch(app.roomName); }, 1000);
  },

  // string escaping: return str.replace(/&/g, '&amp;').replace(</g, '&lt;');
  // 
  send: function(message) {
    //console.log(JSON.stringify(message));
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        //console.log('chatterbox: Message sent');
        message.createdAt = data.createdAt;
        app.renderMessage(message);
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(room) {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: (room === undefined || room === '') ? { order: '-createdAt' } : { order: '-createdAt', where: '{"roomname": "' + room + '"}' },
      contentType: 'application/json',
      success: function(data) {
        //console.log('chatterbox: Message received');
        app.parse(data, data.results.length);
      },
      error: function(data) {
        console.error('chatterbox: Failed to receive message');
      }
    });
  },

  clearMessages: function() {
    //$(document).ready(function() {
      //$('#roomButton').on('click', function() {
        $('#chats').html('');
        //renderRoom();
      //});
    //})
  },

  parse: function(data, length) {
    $('.post').remove();
    for (var i = 0; i < length; i++) {
      var {username, roomname, text, createdAt} = data.results[i]; //data.results[i];
      var element = $('<div class=\'username ' + (username === undefined || username.includes('<') || username.includes('$') ? 'anonymous' : username.split(' ').join()) + '\'>');
      element.text(createdAt + ": " + _.escape(username) + ' [' + (roomname === undefined || username.includes('<') || username.includes('$') ? roomname = 'lobby' : roomname) + '] ' + ' : ' + text);
      $('#chats').append(element);      
    }
  },

  renderMessage: function(data) {
    $('.post').remove();
    var {username, roomname, text, createdAt} = data; //data.results[i];
    var element = $('<div class=\'username ' + (username === undefined || username.includes('<') || username.includes('$') ? username = 'anonymous' : username.split(' ').join()) + '\'>');
    element.text(createdAt + ": " + _.escape(username) + ' [' + (roomname === undefined || username.includes('<') || username.includes('$') ? roomname = 'lobby' : roomname) + '] ' + ' : ' + text);
    $('#chats').append(element);
  },    


  renderRoom: function(room) {
    /* /$(document).ready(function() {
      $('#roomButton').on('click', function() {
        console.log(room);
        app.roomName=$('#roomInput').val();
        app.fetch(app.roomName);
        //app.clearMessages();
        if (room !== undefined && room !== '' && !(room.includes('<') || room.includes('$'))) {
          $('#roomSelect').append('<option value=' + room + '>' + room + '</option>');
        }
      });
    });* /
    roomName = room;
  }, 

  handleSubmit: function() {
    $(document).ready(function() {
      $('#sendButton').on('click', function() {
        var message = {};
        message.username = window.location.search.slice(10);
        message.text = $('#messageInput').val();
        message.roomname = app.roomName;
        app.send(message);            
      });
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
};*/

class App {
  constructor() {
    this.roomName = undefined,
    this.rooms = {},
    this.friends = [],
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
  }

  init() {
    $(document).ready(function() {
      $('refresh').on('click', function() {
        this.fetch();
      });
      
    });
  }

  send(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        message.createdAt = data.createdAt;
        this.renderMessage(message);
        this.fetch();
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  }
  fetch() {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: (this.roomName === undefined || this.roomName === '') ? { order: '-createdAt' } : { order: '-createdAt', where: '{"roomname": "' + this.roomName + '"}' },
      contentType: 'application/json',
      success: (data) => {
        this.clearMessages();
        //console.log(data.results);
        // 
        _.each(/*_.filter(data.results, function(obj) { return obj.roomname === room || obj.roomname === undefined })*/data.results, (value) => {
          this.renderMessage(value);
        });
      },
      error: function (data) {
        console.error('chatterbox: Failed to fetch messages');
      }
    });
  }

  clearMessages() {
    $('#chats').empty();
  }

  renderMessage(message) {
    if (this.roomName === undefined || this.roomName === message.roomname) {
      var text = this.friends.includes(_.escape(message.username)) ? '<strong>' + _.escape(message.text) + '</strong>' : _.escape(message.text);
      $('#chats').append('<div class="chat"><p>' + '<span class="createdAt">' + _.escape(message.createdAt) + '</span>' + '<span class="username" id="' + _.escape(message.username) + '" data-username> ' + _.escape(message.username) + '</span> <span class="roomname" data-roomname>[' + _.escape(message.roomname) + ']</span>' + ' : <span id="message ' + _.escape(message.username) + '">' + text + '</span></p></div>');
      this.renderRoom(_.escape(message.roomname));
      $('.username').click((value) => { this.addFriend(_.escape(value.target.id)); });
    }
  }

  // expand renderRoom to filter

  filterRoom(room) {
    var room = $('#roomSelect option:selected').val();
    if (!room) {
      room = 'lobby';
    } 
    this.clearMessages();
    this.roomName = room;
    this.fetch();
  }

  renderRoom(room) {
    if (room !== undefined && room !== '' && this.rooms[room] === undefined) {
      $('#roomSelect').append('<option value="' + _.escape(room) + '">' + _.escape(room) + '</option>');
      this.rooms[room] = true;
    }
  }

  changeRoom(e) { // adds a new room
    e.preventDefault();
    $('#roomSelect').append('<option value="' + _.escape($('.change').val()) + '">' + _.escape($('.change').val()) + '</option>');
    this.rooms[$('.change').val()] = true;    
  }

  addFriend(friend) {    
    if (!this.friends.includes(friend)) {
      this.friends.push(friend); 
      $('span #message ' + friend).addClass('friend');
      $('span #message ' + friend).wrap('<strong></strong>');
      this.fetch();
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.send({
      username: $('.username2').text(),
      text: $('.message2').val(),
      roomname: $('#roomSelect').val()
    });
  }



}

$(document).ready(function() {
  var app = new App();
  app.init();
  app.fetch();

  $('.refresh').on('click', function() {
    app.fetch();
  });

  // To see all messages again
  /*$('.reset').on('click', function() {
    this.roomName === undefined;
    app.fetch();
  });*/

  $('select').on('change', function(value) {
    app.filterRoom(value);
  });

  $('.username2').text(window.location.search.substr(10));

  $('.username').click(function(event) {
    app.addFriend(event);
  });


  $('.changeRoom').click(function(event) {
    app.changeRoom(event);
  });
  
  $('.submit').click( function(event) {
    app.handleSubmit(event);
  });
});