import store from "@/redux/store";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '../env';

export const logError = async (
    error_message: string, 
    error_type: string, 
    error_stack_trace: string
): Promise<boolean> => {
    // Get the current state directly from the store
    const state = store.getState();
    const currentUserID = state.userWalletData.currentUserID;

    console.log("Error Logging");
    try {
        const response = await fetch(`${MYFYE_BACKEND}/log_error`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': MYFYE_BACKEND_KEY,
            },
            body: JSON.stringify({
                user_id: currentUserID,
                error_message,
                error_type,
                error_stack_trace
            })
        });

        if (!response.ok) {
            throw new Error('Failed to log error');
        }

        const data = await response.json();
        console.log("Error log response:", data);
        return true;
    } catch (error) {
        console.error("Error logging to backend:", error);
        return false;
    }
};