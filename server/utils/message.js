var generateMessage = (from,text) => {
    return {
        from,
        text,
        date: new Date().getTime()
    }
}

var generateLocationMessage = (from, lat, long) => {
    return {
        from,
        url : `https://google.com/maps?q=${lat},${long}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {generateMessage, generateLocationMessage}