const pool = require('../db');
const { create_new_on_ramp_path } = require('../routes/onOffRamp/receiver');
const { updateKycVerified } = require('./userDb');

async function createUserKYC(data) {
    const {
        user_id,
        address_line_1,
        city,
        state_province_region,
        postal_code,
        country,
        date_of_birth,
        first_name,
        last_name,
        tax_id,
        id_doc_type,
        id_doc_front_file,
        id_doc_back_file,
        id_doc_country
    } = data;

    const query = `
        INSERT INTO user_kyc (
            user_id,
            address_line_1,
            city,
            state_province_region,
            postal_code,
            country,
            date_of_birth,
            first_name,
            last_name,
            tax_id,
            id_doc_type,
            id_doc_front_file,
            id_doc_back_file,
            id_doc_country
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *;
    `;

    const values = [
        user_id,
        address_line_1,
        city,
        state_province_region,
        postal_code,
        country,
        date_of_birth,
        first_name,
        last_name,
        tax_id,
        id_doc_type,
        id_doc_front_file,
        id_doc_back_file,
        id_doc_country
    ];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Failed to create user KYC record');
        }
        console.log("User KYC creation result:", JSON.stringify(result.rows[0], null, 2));

        create_new_on_ramp_path(data);

        

        updateKycVerified(user_id, true);

        // to do: create new dinari user
        
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user KYC:', error);
        // to do error log
        throw error;
    }
}

async function getAllKYCUsers() {
    const query = `
        SELECT uk.*, u.email, u.phone_number, u.kyc_verified, u.creation_date
        FROM user_kyc uk
        JOIN users u ON uk.user_id = u.uid
        ORDER BY u.creation_date DESC;
    `;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error getting all KYC users:', error);
        throw error;
    }
}

async function deleteKYCUser(userId) {
    const query = `
        DELETE FROM user_kyc 
        WHERE user_id = $1
        RETURNING *;
    `;

    try {
        const result = await pool.query(query, [userId]);
        if (result.rows.length === 0) {
            throw new Error('KYC user record not found');
        }
        console.log("KYC user deletion result:", JSON.stringify(result.rows[0], null, 2));

        // Update the user's KYC verification status to false
        await updateKycVerified(userId, false);
        
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting KYC user:', error);
        throw error;
    }
}

module.exports = {
    createUserKYC,
    getAllKYCUsers,
    deleteKYCUser
};