const { getSolanaTokenTransfers } = require('./solanaTokenTransfers');

async function transactionHistory(data) {
    console.log("\n=== New Transaction History Request Received ===");
    
    if (!data.user_id || !data.evm_public_key || !data.sol_public_key) {
        console.error('Missing required fields');
        throw new Error('User ID, EVM public key, and Solana public key are required');
    }

    try {
        const solanaTransfers = await getSolanaTokenTransfers({
            solana_address: data.sol_public_key,
            debug: data.debug || true // Enable debug by default for now
        });

        const cleanedData = await cleanData(data.sol_public_key, solanaTransfers)

        return {
            success: true,
            user_id: data.user_id,
            evm_public_key: data.evm_public_key,
            sol_public_key: data.sol_public_key,
            cleanedTransactions: cleanedData,
            //ßtotalTransfers: solanaTransfers.totalTransfers || 0
        };

    } catch (error) {
        console.error('Error in transactionHistory:', error);
        throw error;
    }
}

async function cleanData(sol_public_key, solanaTransfers) {
    if (!solanaTransfers || !solanaTransfers.transfers) {
        return [];
    }

    const cleanedTransactions = [];

    for (const transaction of solanaTransfers.transfers) {
        const { signature, timestamp, tokenTransfers } = transaction;
        
        if (!tokenTransfers || tokenTransfers.length === 0) {
            continue;
        }

        console.log(`\n=== PROCESSING TRANSACTION ${signature} ===`);
        console.log('Complete transaction data:', JSON.stringify(transaction, null, 2));
        console.log('Token transfers count:', tokenTransfers.length);
        console.log('User address:', sol_public_key);

        let cleanedTransaction = {
            signature,
            timestamp,
            input_amount: null,
            output_amount: null,
            input_mint: null,
            output_mint: null,
            type: null
        };

        // Log all token transfers with analysis
        console.log('\n--- TOKEN TRANSFER ANALYSIS ---');
        tokenTransfers.forEach((transfer, index) => {
            console.log(`Transfer ${index + 1}:`, {
                mint: transfer.mint,
                amount: transfer.tokenAmount,
                sender: transfer.sender,
                receiver: transfer.receiver,
                type: transfer.type,
                userIsSender: transfer.sender === sol_public_key,
                userIsReceiver: transfer.receiver === sol_public_key,
                isSOL: transfer.mint === 'So11111111111111111111111111111111111111112'
            });
        });

        if (tokenTransfers.length === 1) {
            // Single token transfer - either deposit or withdraw
            const transfer = tokenTransfers[0];
            
            console.log("Single transfer detected - deposit or withdraw");
            console.log("Transfer details:", transfer);
            
            if (transfer.sender === sol_public_key) {
                // User is sending - withdraw
                console.log("[DEBUG] WITHDRAW - Raw transfer data:", {
                    mint: transfer.mint,
                    tokenAmount: transfer.tokenAmount,
                    sender: transfer.sender,
                    receiver: transfer.receiver,
                    type: transfer.type
                });
                cleanedTransaction.type = 'withdraw';
                cleanedTransaction.input_amount = transfer.tokenAmount;
                cleanedTransaction.input_mint = transfer.mint;
                console.log("Classified as WITHDRAW - Amount:", transfer.tokenAmount);
            } else if (transfer.receiver === sol_public_key) {
                // User is receiving - deposit
                console.log("[DEBUG] DEPOSIT - Raw transfer data:", {
                    mint: transfer.mint,
                    tokenAmount: transfer.tokenAmount,
                    sender: transfer.sender,
                    receiver: transfer.receiver,
                    type: transfer.type
                });
                cleanedTransaction.type = 'deposit';
                cleanedTransaction.input_amount = transfer.tokenAmount;
                cleanedTransaction.input_mint = transfer.mint;
                console.log("Classified as DEPOSIT - Amount:", transfer.tokenAmount);
            }
        } else {
            // Multiple token transfers - likely a swap
            console.log("Multiple transfers detected - likely swap");
            cleanedTransaction.type = 'swap';
            
            // Find what the user is sending (output) and receiving (input)
            const userSending = tokenTransfers.filter(t => t.sender === sol_public_key);
            const userReceiving = tokenTransfers.filter(t => t.receiver === sol_public_key);
            
            console.log('User sending transfers:', userSending.map(t => ({
                mint: t.mint,
                amount: t.tokenAmount,
                isSOL: t.mint === 'So11111111111111111111111111111111111111112'
            })));
            
            console.log('User receiving transfers:', userReceiving.map(t => ({
                mint: t.mint,
                amount: t.tokenAmount,
                isSOL: t.mint === 'So11111111111111111111111111111111111111112'
            })));
            
            // Smart algorithm to determine main swap tokens
            const smartSending = findMainSwapToken(userSending, 'sending');
            const smartReceiving = findMainSwapToken(userReceiving, 'receiving');
            
            console.log('Smart algorithm picks:');
            console.log('  Input (user sending):', smartSending ? {
                mint: smartSending.mint,
                amount: smartSending.tokenAmount,
                isSOL: smartSending.mint === 'So11111111111111111111111111111111111111112',
                reason: smartSending.reason
            } : 'None');
            console.log('  Output (user receiving):', smartReceiving ? {
                mint: smartReceiving.mint,
                amount: smartReceiving.tokenAmount,
                isSOL: smartReceiving.mint === 'So11111111111111111111111111111111111111112',
                reason: smartReceiving.reason
            } : 'None');
            
            // Current logic (for comparison)
            const userSendingFirst = tokenTransfers.find(t => t.sender === sol_public_key);
            const userReceivingFirst = tokenTransfers.find(t => t.receiver === sol_public_key);
            
            console.log('Current logic would pick:');
            console.log('  Output (first send):', userSendingFirst ? {
                mint: userSendingFirst.mint,
                amount: userSendingFirst.tokenAmount,
                isSOL: userSendingFirst.mint === 'So11111111111111111111111111111111111111112'
            } : 'None');
            console.log('  Input (first receive):', userReceivingFirst ? {
                mint: userReceivingFirst.mint,
                amount: userReceivingFirst.tokenAmount,
                isSOL: userReceivingFirst.mint === 'So11111111111111111111111111111111111111112'
            } : 'None');
            
            // Use smart algorithm - sending = input, receiving = output
            if (smartSending) {
                cleanedTransaction.input_amount = smartSending.tokenAmount;
                cleanedTransaction.input_mint = smartSending.mint;
            }
            
            if (smartReceiving) {
                cleanedTransaction.output_amount = smartReceiving.tokenAmount;
                cleanedTransaction.output_mint = smartReceiving.mint;
            }
        }

        console.log('\n--- FINAL CLASSIFICATION ---');
        console.log('Type:', cleanedTransaction.type);
        console.log('Input mint:', cleanedTransaction.input_mint);
        console.log('Input amount:', cleanedTransaction.input_amount);
        console.log('Output mint:', cleanedTransaction.output_mint);
        console.log('Output amount:', cleanedTransaction.output_amount);
        console.log('=== END TRANSACTION PROCESSING ===\n');

        cleanedTransactions.push(cleanedTransaction);
    }

    return cleanedTransactions;
}

function findMainSwapToken(transfers, direction) {
    if (!transfers || transfers.length === 0) {
        return null;
    }
    
    // If only one transfer, return it
    if (transfers.length === 1) {
        return { ...transfers[0], reason: 'only_option' };
    }
    
    // Filter out very small SOL transfers (likely gas/fees)
    // SOL transfers under 0.01 SOL are likely gas/fees
    const SOL_MINT = 'So11111111111111111111111111111111111111112';
    const MIN_SOL_AMOUNT = 0.01;
    
    const nonTinySOLTransfers = transfers.filter(t => {
        if (t.mint === SOL_MINT && t.tokenAmount < MIN_SOL_AMOUNT) {
            return false; // Filter out small SOL transfers
        }
        return true;
    });
    
    console.log(`[findMainSwapToken] Direction: ${direction}, Original: ${transfers.length}, After filtering small SOL: ${nonTinySOLTransfers.length}`);
    
    // If we have transfers after filtering, use those
    const candidateTransfers = nonTinySOLTransfers.length > 0 ? nonTinySOLTransfers : transfers;
    
    // Prioritize non-SOL transfers
    const nonSOLTransfers = candidateTransfers.filter(t => t.mint !== SOL_MINT);
    
    if (nonSOLTransfers.length > 0) {
        // Pick the largest non-SOL transfer
        const largest = nonSOLTransfers.reduce((max, current) => 
            current.tokenAmount > max.tokenAmount ? current : max
        );
        return { ...largest, reason: 'largest_non_sol' };
    }
    
    // If all remaining transfers are SOL, pick the largest one
    const largestSOL = candidateTransfers.reduce((max, current) => 
        current.tokenAmount > max.tokenAmount ? current : max
    );
    return { ...largestSOL, reason: 'largest_sol' };
}

module.exports = {
    transactionHistory
};