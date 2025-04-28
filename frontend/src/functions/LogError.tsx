import store from "@/redux/store";

export const logError = async (
    error_message: string, 
    error_type: string, 
    error_stack_trace: string
): Promise<boolean> => {
    // Get the current state directly from the store
    const state = store.getState();
    const currentUserID = state.userWalletData.currentUserID;

    console.log("Error Logged");
    console.log("currentUserID", currentUserID);
    console.log("error_message", error_message);
    console.log("error_type", error_type);
    console.log("error_stack_trace", error_stack_trace);  
    return true;
};