const pool = require("../db");

async function createContact(data) {
    console.log("\n=== New Contact Creation Request Received ===");
    console.log("Contact data:", JSON.stringify(data, null, 2));

    const { user_id, contact_id } = data;

    if (!user_id || !contact_id) {
        throw new Error('User ID and Contact ID are required');
    }

    // Check if contact already exists
    const checkQuery = `
        SELECT * FROM user_contacts 
        WHERE user_id = $1 AND contact_id = $2
    `;

    const checkResult = await pool.query(checkQuery, [user_id, contact_id]);
    
    if (checkResult.rows.length > 0) {
        return { message: 'Contact already exists', contact: checkResult.rows[0] };
    }

    // Create new contact
    const query = `
        INSERT INTO user_contacts (user_id, contact_id)
        VALUES ($1, $2)
        RETURNING *
    `;

    const values = [user_id, contact_id];

    try {
        const result = await pool.query(query, values);
        console.log("Contact creation result:", JSON.stringify(result.rows[0], null, 2));
        return result.rows[0];
    } catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
}

async function getContacts(data) {
    console.log("\n=== Get Contacts Request Received ===");
    console.log("Request data:", JSON.stringify(data, null, 2));

    const { user_id } = data;

    if (!user_id) {
        throw new Error('User ID is required');
    }

    const query = `
        SELECT u.* 
        FROM users u
        JOIN user_contacts uc ON u.uid = uc.contact_id
        WHERE uc.user_id = $1
        ORDER BY u.first_name ASC
    `;

    try {
        const result = await pool.query(query, [user_id]);
        console.log(`Found ${result.rows.length} contacts for user ${user_id}`);
        return result.rows;
    } catch (error) {
        console.error('Error getting contacts:', error);
        throw error;
    }
}

async function searchUser(data) {
    console.log("\n=== User Search Request Received ===");
    console.log("Search data:", JSON.stringify(data, null, 2));

    const { current_user_id, query } = data;

    if (!current_user_id || !query) {
        throw new Error('Current user ID and search query are required');
    }

    const searchQuery = `
        SELECT u.*,
        CASE 
            WHEN uc.contact_id IS NOT NULL THEN 1
            ELSE 0
        END AS is_contact
        FROM users u
        LEFT JOIN user_contacts uc
        ON u.uid = uc.contact_id AND uc.user_id = $1
        WHERE
        u.uid != $1 AND (
            u.first_name ILIKE '%' || $2 || '%' OR
            u.last_name ILIKE '%' || $2 || '%' OR
            u.email ILIKE '%' || $2 || '%' OR
            u.phone_number ILIKE '%' || $2 || '%'
        )
        ORDER BY is_contact DESC, u.first_name ASC
        LIMIT 25
    `;

    try {
        const result = await pool.query(searchQuery, [current_user_id, query]);
        console.log(`Found ${result.rows.length} users matching query "${query}"`);
        return result.rows;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
}

async function getTopContacts(data) {
    console.log("\n=== Get Top Contacts Request Received ===");
    console.log("Request data:", JSON.stringify(data, null, 2));

    const { current_user_id } = data;

    if (!current_user_id) {
        throw new Error('Current user ID is required');
    }

    const query = `
        SELECT u.*, COUNT(*) as freq
        FROM pay_transactions p
        JOIN users u ON u.uid = p.receiver_id
        WHERE p.sender_id = $1
        GROUP BY u.uid
        ORDER BY freq DESC
        LIMIT 8
    `;

    try {
        const result = await pool.query(query, [current_user_id]);
        console.log(`Found ${result.rows.length} top contacts for user ${current_user_id}`);
        return result.rows;
    } catch (error) {
        console.error('Error getting top contacts:', error);
        throw error;
    }
}

module.exports = {
    createContact,
    getContacts,
    searchUser,
    getTopContacts
};