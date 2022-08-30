module.exports = (io)=>{
    const router = require("express").Router();

    router.get('/', (req, res)=>{
        res.send('Conference App !')
    })

    io.on('connection', socket=>{
        socket.on('new-join', (roomID, name) => {
            socket.to(roomID).broadcast.emit('user-joined', name)
        })
    
        socket.on('send', message => {
            socket.broadcast.emit('recieve', {message, uname:users[socket.id]})
        })
    
        socket.on('disconnect', message=>{
            socket.to(roomID).broadcast.emit('left', users[socket.id])
        })
    })

    return router
}