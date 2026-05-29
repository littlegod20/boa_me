export interface Conversation {
    id: string
    booking_id?: string
    customer_id: string
    provider_id: string
    created_at: Date
    updated_at: Date
}

export interface Message {
    id: string
    content: string
    conversation_id: string
    sender_id: string
    timestamp: Date
    is_seen: boolean
    created_at: Date
    updated_at: Date
}

    export type CreateConversationInput = {
    booking_id?: string
    customer_id: string
    provider_id: string
}

export type CreateMessageInput = {
    content: string
    conversation_id: string
    sender_id: string
}