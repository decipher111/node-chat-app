const moment = require('moment')

var time = moment(new Date().getTime())


console.log(time.format('h:mma'))