import cron from 'node-cron'
import { publishPayoutJob } from '../queues/payout.queue'
import { fetchEligiblePayouts } from '../services/booking.service'

export const startPayoutCronJob = () => {
    cron.schedule('0 * * * *', async ()=>{
        console.log('Running payout cron job...')
        try {
                const eligibleBookings = await fetchEligiblePayouts()
                console.log(`Found ${eligibleBookings.length} eligible payouts`)

                for (const booking of eligibleBookings) {
                    await publishPayoutJob({
                        booking_id: booking.id,
                        provider_user_id: booking.provider_user_id,  // note: provider_user_id from query
                        amount: booking.payment_amount,
                        payment_id: booking.payment_id,
                        customer_id: booking.customer_id
                    })
                }
            } catch (error) {
                console.error('Payout cron job error:', error)
                throw error
            }
    })
    console.log('Payout cron job scheduled')
}