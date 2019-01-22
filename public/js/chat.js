var socket = io();

var autoScroll = function() {
    // selectors
    var messages = $('#messages')
    var newMessage = messages.children('li:last-child')
    // heights
    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight = newMessage.innerHeight()
    var prevMessage = newMessage.prev().innerHeight()

    if(clientHeight+scrollTop+newMessageHeight+prevMessage>=scrollHeight){
        messages.scrollTop(scrollHeight)
    }

}

socket.on('connect', function() {
    var params = jQuery.deparam(window.location.search)
    socket.emit('join', params, function(err) {
        if(err){
            alert(err)
            window.location.href = '/'
        }else{
            console.log('no error')
        }
    })
})


var leaveRoom = $('#leave-room')

leaveRoom.on('click', function(){
    var params = jQuery.deparam(window.location.search)
    console.log(params)
    socket.emit('leaveRoom', params, function(err) {
        if(err){
            alert('cannot leave room')
        }
        else{
            window.location.href = '/'
        }
    })
})

socket.on('disconnect', function() {
    console.log('Disconnected from server');
})

socket.on('newLocationMessage', function(data){
    var template = $('#location-template').html()
    var html = Mustache.render(template, {
        url: data.url,
        from: data.from,
        createdAt: data.createdAt
    })
    $('#messages').append(html)
    autoScroll()
})

socket.on('newMessage', function(data) { 
    var template = $('#message-template').html()
    var html = Mustache.render(template, {
        text: data.text,
        from: data.from,
        createdAt: data.createdAt
    })
    $('#messages').append(html)
    autoScroll()
})

$('#message-form').on('submit', function (e) {
    e.preventDefault()

    socket.emit('createMessage', {
        from: 'user', 
        text: $('[name=message]').val()
    }, function(){
        $('[name=message]').val('')
    })
})

var locationButton = $('#send-location')

locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('browser does not support geolocation')
    }
    locationButton.attr('disable','disable').text('sending location...')
    navigator.geolocation.getCurrentPosition(function (location) {
        locationButton.removeAttr('disable').text('Send Location')
        socket.emit('createLocationMessage', {
            lat: location.coords.latitude,
            long: location.coords.longitude 
        })
    }, function (err) {
        alert('unable to fetch location')
    })
})
