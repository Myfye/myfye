import axios from 'axios';
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '@/env';

export default async function transaction_list(userId, evmPubKey, solPubKey) {
    try {
        const response = await axios.post(`${MYFYE_BACKEND}/get_transaction_history`, {
            user_id: userId,
            evm_public_key: evmPubKey,
            sol_public_key: solPubKey,
            limit: 50,
            offset: 0
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': MYFYE_BACKEND_KEY
            }
        });

        console.log('Transaction history:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        throw error;
    }

    /*
EXAMPLE 
    curl -X POST http://localhost:3001/get_transaction_history \
  -H "Content-Type: application/json" \
  -H "x-api-key: backendkey" \
  -d '{
    "user_id": "test_user_123",
    "evm_public_key": "0xf740Ca900d1B618769EABad6C7fdF31F28568fE1",
    "sol_public_key": "4B23YAyYbXiFFixkjaSSLkALRQ4eogVa9BMWvpKoNDDH",
    "limit": 50,
    "offset": 0
  }'
    */
    
}