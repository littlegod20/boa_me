export enum TransactionType{
    PAYOUT = 'payout',
    PAYIN = 'payin',
    REFUND = 'refund'
}

export enum TransactionStatus{
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface Transaction {
    id: string
    booking_id:string
    customer_id: string
    provider_id: string
    payment_id: string
    amount: number
    transaction_type: TransactionType
    transaction_status: TransactionStatus
    created_at: Date
    updated_at: Date
}

export type CreateTransaction = {
    booking_id:string
    customer_id: string
    provider_id: string
    payment_id: string
    amount: number
    transaction_type:TransactionType
    transaction_status: TransactionStatus
}
