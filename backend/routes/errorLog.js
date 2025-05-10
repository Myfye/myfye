const pool = require("../db");

async function createErrorLog(data) {
    console.log("\n=== New Error Log Creation Request Received ===");
    console.log("Error log data:", JSON.stringify(data, null, 2));

    // Create UTC timestamp
    const now = new Date();
    const utcTimestamp = now.toISOString();
    
    console.log("Creating error log with UTC timestamp:", utcTimestamp);

    const query = `
        INSERT INTO error_logs (
            user_id,
            error_message,
            error_type,
            error_stack_trace,
            creation_date
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;

    const values = [
        data.user_id || null,
        data.error_message,
        data.error_type,
        data.error_stack_trace || null,
        now
    ];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Failed to create error log');
        }
        console.log("Error log creation result:", JSON.stringify(result.rows[0], null, 2));
        console.log("Error log creation date (UTC):", utcTimestamp);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating error log:', error);
        throw error;
    }
}

async function getErrorLogs() {
    console.log("\n=== Fetching All Error Logs ===");

    const query = `
        SELECT 
            el.*,
            u.email as user_email,
            u.first_name as user_first_name,
            u.last_name as user_last_name
        FROM error_logs el
        LEFT JOIN users u ON el.user_id = u.uid
        ORDER BY el.creation_date DESC
    `;

    try {
        const result = await pool.query(query);
        console.log(`Found ${result.rows.length} error logs`);
        return result.rows;
    } catch (error) {
        console.error('Error fetching error logs:', error);
        throw error;
    }
}

async function deleteErrorLog(errorLogId) {
    console.log("\n=== Deleting Error Log ===");
    console.log("Error log ID:", errorLogId);

    const query = `
        DELETE FROM error_logs
        WHERE id = $1
        RETURNING *
    `;

    try {
        const result = await pool.query(query, [errorLogId]);
        if (result.rows.length === 0) {
            throw new Error('Error log not found');
        }
        console.log("Error log deletion result:", JSON.stringify(result.rows[0], null, 2));
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting error log:', error);
        throw error;
    }
}

module.exports = {
    createErrorLog,
    getErrorLogs,
    deleteErrorLog
};