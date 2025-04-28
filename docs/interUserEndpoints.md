# InterUser API Endpoints Documentation

This document provides information about the endpoints available for managing user interactions and contacts.

## Base URL
All endpoints are relative to your backend base URL.

## Authentication
All requests require an `x-api-key` header with your backend API key.

## Endpoints

### Create New Contact
**Endpoint:** `/create_contact`  
**Method:** POST  
**Description:** Creates a new contact connection between two users.

**Request Body:**
```json
{
    "user_id": "string",      // The ID of the user creating the contact
    "contact_id": "string"    // The ID of the user to be added as a contact
}
```

**Response:**
- If successful: Returns the created contact object
- If contact already exists: Returns a message indicating the contact already exists

### Get User Contacts
**Endpoint:** `/get_contacts`  
**Method:** POST  
**Description:** Retrieves all contacts for a specific user.

**Request Body:**
```json
{
    "user_id": "string"    // The ID of the user whose contacts to retrieve
}
```

**Response:**
Returns an array of user objects representing the contacts, sorted alphabetically by first name.

### Search Users
**Endpoint:** `/search_users`  
**Method:** POST  
**Description:** Searches for users based on a query string.

**Request Body:**
```json
{
    "current_user_id": "string",    // The ID of the user performing the search
    "query": "string"               // The search query (matches against first name, last name, email, or phone number)
}
```

**Response:**
Returns an array of user objects matching the search criteria, with an additional `is_contact` field indicating if the user is already a contact. Results are limited to 25 users and are sorted with existing contacts appearing first.

### Get Top Contacts
**Endpoint:** `/get_top_contacts`  
**Method:** POST  
**Description:** Retrieves the top contacts for a user based on transaction frequency.

**Request Body:**
```json
{
    "current_user_id": "string"    // The ID of the user whose top contacts to retrieve
}
```

**Response:**
Returns an array of up to 8 user objects representing the most frequently transacted contacts, sorted by transaction frequency.

## Error Handling
All endpoints return appropriate error messages with a 500 status code if something goes wrong. Common error cases include:
- Missing required fields
- Invalid user IDs
- Database errors

## Example Usage

```javascript
// Example of creating a new contact
const response = await fetch('/create_contact', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'your-api-key'
    },
    body: JSON.stringify({
        user_id: 'user123',
        contact_id: 'user456'
    })
});

// Example of searching for users
const searchResponse = await fetch('/search_users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'your-api-key'
    },
    body: JSON.stringify({
        current_user_id: 'user123',
        query: 'john'
    })
});
``` 