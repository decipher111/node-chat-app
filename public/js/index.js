var socket = io();

socket.on('connect', function() {
    console.log('connected to server')
})

socket.on('disconnect', function() {
    console.log('Disconnected from server');
})

socket.on('newLocationMessage', function(data){
    $('#messages').append(`<li>${data.from}:</li>`).append(`<a target="_blank" href=${data.url}>My current location</a>`)
})

socket.on('newMessage', function(data) {
    console.log(data)
    $('#messages').append($('<li></li>').text(`${data.from}: ${data.text}`))
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