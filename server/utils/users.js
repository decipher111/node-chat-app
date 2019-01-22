// class Person {
//     constructor(name, age){
//         console.log(name, age)
//     }
// }

// var me = new Person('someone', 11)

class User {
    constructor(){
        this.users = []
    }
    addUser(id, name, room) {
        var user = {id, name, room}
        this.users.push(user)
        user
    }
    removeUser(id){
        var user = this.users.getUser(id)

        if(user){
            this.users.filter((user) => {
                user.id !== id
            })
        }
        return user
    }
    getUser(id){
        return this.users.filter((user) => user.id === id)[0]
    }
    getUserList(room){
        var arr = this.user.filter((user) => {
            return user.room === room
        })
        var namesArr = users.map((user) => {
            return user.name
        })
        return namesArr
        

    }   
}

// var newUser = new User()
// console.log(newUser.addUser(1, 'someName', 'room1'))
