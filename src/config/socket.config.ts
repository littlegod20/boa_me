import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "../utils/jwt.utils";
import { fetchUserConversations } from "../services/conversation.service";
import { insertMessage } from "../services/conversation.service";

let io:Server

export const initializeSocket = (httpServer:HttpServer) => {
    io = new Server(httpServer, {
        cors:{
            origin: '*',
            methods: ['GET', 'POST']
        }
    })

    // authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization
            if(!token) return next(new Error('Authentication required'))
            
            const tokenString = typeof token === 'string' 
            ? token.replace('Bearer ', '')
            : ''

            const payload = verifyToken(tokenString)
            socket.data.user = payload
            next()
        } catch (error) {
            next(new Error('Invalid token'))
        }
    })

    io.on('connect', async(socket)=>{
        const user = socket.data.user
        console.log(`User connected: ${user.id}`)

        // join all conversation rooms
        const conversations = await fetchUserConversations(
            {page: 1, limit: 100},
            user.id
        )
        conversations.forEach(convo => {
            socket.join(`conversation_${convo.id}`)
        })
        console.log(`User ${user.id} joined ${conversations.length} conversation rooms`)

        // handle send_message event
        socket.on('send_message', async (data)=>{
            console.log('send_message:', data)
            try {
                const {conversation_id, content} = data

                if (!conversation_id || !content){
                    socket.emit('error', {message: 'Missing conversation_id or content'})
                    return
                }

                // save message to database
                const message = await insertMessage({
                    content,
                    conversation_id,
                    sender_id: user.id
                })

                // emit to everyone in the conversation room including sender
                io.to(`conversation_${conversation_id}`).emit('new_message', message)
            } catch (error) {
                console.error('send_message error:', error)
                socket.emit('error', {message: 'Failed to send message'})
            }
        })

        // handle message_seen event
        socket.on('message_seen', async(data)=>{
            const {conversation_id} = data

            // mark messages as seen TODO: add later
            io.to(`conversation_${conversation_id}`).emit('message_seen', {
                conversation_id,
                seen_by: user.id
            })
        })

        // handle socket disconnect
        socket.on('disconnect', ()=>{
            console.log(`User disconnected: ${user.id}`)
        })
    })

    return io
}