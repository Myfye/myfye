const pool = require("../db");

async function createErrorLog(data) {
    console.log("\n=== New Error Log Creation Request Received ===");
    console.log("Error log data:", JSON.stringify(data, null, 2));

    const query = `
        INSERT INTO error_logs (
            user_id,
            error_message,
            error_type,
            error_stack_trace
        ) VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const values = [
        data.user_id || null,
        data.error_message,
        data.error_type,
        data.error_stack_trace || null
    ];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Failed to create error log');
        }
        console.log("Error log creation result:", JSON.stringify(result.rows[0], null, 2));
        return result.rows[0];
    } catch (error) {
        console.error('Error creating error log:', error);
        throw error;
    }
}

module.exports = {
    createErrorLog
};