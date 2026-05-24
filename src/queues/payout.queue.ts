import { getChannel } from "../config/rabbitmq.config"
import { PayoutJobPayload } from "../types/payout.types"

export const publishPayoutJob = async (payload: PayoutJobPayload) => {
    const channel = getChannel()
    await channel.assertQueue('payout_queue', { durable: true })
    channel.sendToQueue(
        'payout_queue',
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }  // message survives RabbitMQ restart
    )
    console.log('Payout job published:', payload.booking_id)
}