import { getPool } from "../config/database.config"
import { QueryType } from "../types/pagination.types"
import { CreateService, Service, ServiceWithCategory } from "../types/services.types"



export const fetchAllServices = async(categoryId:string | undefined, query:QueryType):Promise<ServiceWithCategory[] | null> => {
    try {
        const conditions = []
        const values = []
        let index = 1
        
        if (categoryId){
            conditions.push(`services.category_id = $${index++}`)
            values.push(categoryId)
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

        const page = query.page || 1
        const limit = query.limit || 10
        const offset = (page - 1) * limit
        values.push(limit)
        values.push(offset)

        const pool = getPool()
        const result = await pool.query(`
            SELECT
             services.*,
             categories.name AS category_name,
             categories.description AS category_description
            FROM services
            LEFT JOIN categories ON services.category_id = categories.id
            ${whereClause}
            LIMIT $${index++} OFFSET $${index++}
            `, values
        )
        return result.rows || null
    } catch (error) {
        throw error
    }
}

export const findServiceById =  async (serviceId:string):Promise<ServiceWithCategory | null> => {
    try {
        const pool = getPool()
        const result = await pool.query(`
            SELECT
                services.*,
                categories.name AS category_name,
                categories.description AS category_description
            FROM services
            LEFT JOIN categories ON services.category_id = categories.id
            WHERE services.id=$1`, 
            [serviceId]
        )
        return result.rows[0] || null
    } catch (error) {
        throw error
    }
}

export const insertService =  async(input:CreateService):Promise<Service | null> => {
    try {
        const pool = getPool()
        const result = await pool.query(`
            INSERT INTO  services (name, image, description, category_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `, 
            [input.name, input.image, input.description, input.category_id]
        )
        return result.rows[0] || null
    } catch (error) {
        throw error
    }
}

export const modifyService = async(serviceId:string, update:CreateService):Promise<Service | null> => {
    try {
        let fields = []
        let values = []
        let index = 1

        if(update.name){
            fields.push(`name = $${index++}`)
            values.push(update.name)
        }

        if(update.image){
            fields.push(`image = $${index++}`)
            values.push(update.image)
        }

        if(update.description){
            fields.push(`description = $${index++}`)
            values.push(update.description)
        }

        if (update.category_id){
            fields.push(`category_id = $${index++}`)
            values.push(update.category_id)
        }

        values.push(serviceId)

        const pool = getPool()
        const query = `
            UPDATE services 
            SET ${fields.join(', ')}
            WHERE id=$${index}
            RETURNING *
            `
            
        const result = await pool.query(query, values)
        return result.rows[0] || null
    } catch (error) {
        throw error
    }
}

export const deleteService = async(serviceId:string):Promise<Service | null> => {
    try {
        const pool = getPool()
        const result = await pool.query(
            `DELETE FROM services WHERE id=$1 RETURNING *`,
            [serviceId]
        )
        return result.rows[0] || null
    } catch (error) {
        throw error
    }
}