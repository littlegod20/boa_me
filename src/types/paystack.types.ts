
export type PaystackInitialize = {
    status: boolean,
    message:string,
    data: {
        authorization_url: string,
        reference: string
    }
}

enum MomoCode {
    MTN = 'MTN',
    VOD = 'VOD',
    ATL = 'ATL'
}
export type TransferRecipient = {
    type: 'mobile_money' | 'ghipss'
    name: string,
    account_number:string
    bank_code: string | MomoCode,
    currency: 'GHS'
}

export type InitiateTransfer = {
    source: 'balance', // transfer from your Paystack balance
    amount: number, // amount in pesewas
    recipient: string, // recipient_code
    reason: string // description e.g. "Payout for booking #123"
}
