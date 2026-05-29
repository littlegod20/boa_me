import amqp, { Channel, ChannelModel} from 'amqplib'
import { logger } from './logger.config'

let connection:ChannelModel
let channel:Channel

export const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL!)
        channel = await connection.createChannel()
        logger.info('RabbitMQ connected successfully')
    } catch (error) {
        logger.error('RabbitMQ connection error', { error })
        process.exit(1)
    }
}

export const getChannel = () => {
    if (!channel) throw new Error('RabbitMQ not connected')
    return channel
}