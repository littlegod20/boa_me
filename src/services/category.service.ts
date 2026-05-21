import { getPool } from "../config/database.config"
import { Category, CreateCategory } from "../types/category.types"


export const insertCategory = async(input:CreateCategory):Promise<Category | null> =>{
    try {
        const pool = getPool()
        const result = await pool.query(`
            INSERT INTO categories (name, description)
            VALUES ($1, $2)
            RETURNING *
            `, [
                input.name,
                input.description
            ]
        )
        return result.rows[0] || null
        
    } catch (error) {
        throw error
    }
}

export const findCategoryById = async(id:string):Promise<Category | null> => {
    try {
        console.log('get id here:', id)
        const pool = getPool()
        const result = await pool.query(`SELECT * FROM categories WHERE id=$1`,[id])
        console.log("result here:", result)
        return result.rows[0] || null
    } catch (error) {
        console.error('findCategoryById error:', error)
        throw error
    }
}

export const fetchAllCategories = async():Promise<Category[] | null> => {
    try {
        const pool = getPool()
        const result = await pool.query(`SELECT * FROM categories`)
        return result.rows || null
    } catch (error) {
        throw error
    }
}


export const modifyCategory = async(id:string, update:CreateCategory):Promise<Category | null> => {
    try {
        const pool = getPool()

        const fields = []
        const values = []

        let index = 1

        if (update.name){
            fields.push(`name = $${index++}`)
            values.push(update.name)
        }

        if (update.description){
            fields.push(`description = $${index++}`)
            values.push(update.description)
        }

        values.push(id)

        if (fields.length === 0) {
            throw new Error('No fields to update')
        }

        const query = `
            UPDATE categories
            SET ${fields.join(', ')}
            WHERE id=$${index}
            RETURNING *`

        const result = await pool.query(query,values)
        return result.rows[0] || null
    } catch (error) {
        throw error
    }
} 