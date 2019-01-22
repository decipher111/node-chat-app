const moment = require('moment')
var time = moment()

var generateMessage = (from,text) => {
    return {
        from,
        text,
        createdAt: moment(new Date().getTime()).format('h:mma')
    }
}

var generateLocationMessage = (from, lat, long) => {
    return {
        from,
        url : `https://google.com/maps?q=${lat},${long}`,
        createdAt: moment(new Date().getTime()).format('h:mma')
    }
}

module.exports = {generateMessage, generateLocationMessage}