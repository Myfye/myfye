const axios = require('axios');
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

async function getSolanaTokenTransfers({ solana_address, debug = false }) {
    if (!solana_address) throw new Error('Solana address is required');
    if (!HELIUS_API_KEY) throw new Error('Helius API key is required');

    // Debug the specific missing transaction
    if (debug) {
        console.log('[DEBUG] Investigating specific transaction...');
        try {
            await debugTransaction('55WzR4x1K6uia2V2CyS45nKcknsCGwMLDy7ap2Max2nA93kmakjbzap21zRDseUzv57LLegstKS2jUtsXRwMRUaA');
        } catch (error) {
            console.error('[DEBUG] Error investigating transaction:', error);
        }
    }

    const baseUrl = `https://api.helius.xyz/v0/addresses/${solana_address}/transactions?api-key=${HELIUS_API_KEY}`;
    let allTransfers = [];
    let before = undefined;
    let keepGoing = true;
    let pageCount = 0;
    const maxPages = 2000;
    let loggedFirst = false; //temp

    console.log(`[HELIUS] Starting to fetch all token transfers for address: ${solana_address}`);

    while (keepGoing && pageCount < maxPages) {
        let url = baseUrl;
        if (before) url += `&before=${before}`;
        try {
            const { data } = await axios.get(url);
            if (!Array.isArray(data) || data.length === 0) {
                console.log(`[HELIUS] No more transactions found after ${pageCount} pages`);
                break;
            }
            console.log(`[HELIUS] Page ${pageCount + 1}: Found ${data.length} transactions`);

            //temp
            if (!loggedFirst && data.length > 0) {
                console.log('[HELIUS] First transaction object:', JSON.stringify(data[0], null, 2));
                loggedFirst = true;
            }
            //end temp

            // Log transaction types for debugging
            const transactionTypes = data.map(tx => ({
                signature: tx.signature,
                hasTokenTransfers: !!(tx.tokenTransfers && tx.tokenTransfers.length > 0),
                hasInstructions: !!(tx.transaction && tx.transaction.message && tx.transaction.message.instructions),
                hasMeta: !!(tx.meta && tx.meta.postTokenBalances),
                instructionPrograms: tx.transaction?.message?.instructions?.map(inst => inst.program || inst.programId) || []
            }));
            
            console.log(`[HELIUS] Page ${pageCount + 1}: Transaction analysis:`, {
                total: data.length,
                withTokenTransfers: transactionTypes.filter(t => t.hasTokenTransfers).length,
                withInstructions: transactionTypes.filter(t => t.hasInstructions).length,
                withMeta: transactionTypes.filter(t => t.hasMeta).length,
                sampleSignatures: transactionTypes.slice(0, 3).map(t => t.signature)
            });

            // Filter for token transfers and clean up the data
            const tokenTransfers = data
                .filter(tx => {
                    // Debug specific transaction
                    if (tx.signature === '55WzR4x1K6uia2V2CyS45nKcknsCGwMLDy7ap2Max2nA93kmakjbzap21zRDseUzv57LLegstKS2jUtsXRwMRUaA') {
                        console.log('[DEBUG] Found target transaction in filter phase:', {
                            signature: tx.signature,
                            hasTokenTransfers: !!(tx.tokenTransfers && tx.tokenTransfers.length > 0),
                            hasInstructions: !!(tx.transaction && tx.transaction.message && tx.transaction.message.instructions),
                            hasMeta: !!(tx.meta && tx.meta.postTokenBalances),
                            hasAccountKeys: !!(tx.transaction && tx.transaction.message && tx.transaction.message.accountKeys)
                        });
                    }
                    
                    // Check for explicit tokenTransfers
                    if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
                        return true;
                    }
                    
                    // Check for token transfers in instructions
                    if (tx.transaction && tx.transaction.message && tx.transaction.message.instructions) {
                        return tx.transaction.message.instructions.some(instruction => 
                            instruction.program === 'spl-token' || 
                            instruction.programId === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
                        );
                    }
                    
                    // Check for token transfers in parsed instructions
                    if (tx.meta && tx.meta.postTokenBalances && tx.meta.postTokenBalances.length > 0) {
                        return true;
                    }
                    
                    // Check for any SPL token program involvement
                    if (tx.transaction && tx.transaction.message && tx.transaction.message.accountKeys) {
                        return tx.transaction.message.accountKeys.some(key => 
                            key === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
                        );
                    }
                    
                    return false;
                })
                .map(tx => {
                    let transfers = [];
                    
                    // Debug specific transaction
                    if (tx.signature === '55WzR4x1K6uia2V2CyS45nKcknsCGwMLDy7ap2Max2nA93kmakjbzap21zRDseUzv57LLegstKS2jUtsXRwMRUaA') {
                        console.log('[DEBUG] Processing target transaction in map phase:', {
                            signature: tx.signature,
                            tokenTransfers: tx.tokenTransfers,
                            instructions: tx.transaction?.message?.instructions?.map(i => ({ program: i.program, programId: i.programId, parsed: i.parsed?.type }))
                        });
                    }
                    
                    // Extract from tokenTransfers if available
                    if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
                        transfers = tx.tokenTransfers.map(transfer => ({
                            mint: transfer.mint,
                            tokenAmount: transfer.tokenAmount,
                            sender: transfer.fromUserAccount,
                            receiver: transfer.toUserAccount,
                            type: 'explicit'
                        }));
                    }
                    
                    // Extract from meta postTokenBalances if available
                    if (tx.meta && tx.meta.postTokenBalances && tx.meta.postTokenBalances.length > 0) {
                        const preBalances = tx.meta.preTokenBalances || [];
                        const postBalances = tx.meta.postTokenBalances;
                        
                        // Compare pre and post balances to detect transfers
                        postBalances.forEach(post => {
                            const pre = preBalances.find(p => p.accountIndex === post.accountIndex);
                            if (pre && pre.uiTokenAmount.uiAmount !== post.uiTokenAmount.uiAmount) {
                                transfers.push({
                                    mint: post.mint,
                                    tokenAmount: {
                                        amount: (post.uiTokenAmount.uiAmount - pre.uiTokenAmount.uiAmount).toString(),
                                        decimals: post.uiTokenAmount.decimals,
                                        uiAmount: post.uiTokenAmount.uiAmount - pre.uiTokenAmount.uiAmount
                                    },
                                    sender: pre.owner || 'unknown',
                                    receiver: post.owner || 'unknown',
                                    type: 'balance_change'
                                });
                            }
                        });
                    }
                    
                    // Extract from instructions if available
                    if (tx.transaction && tx.transaction.message && tx.transaction.message.instructions) {
                        tx.transaction.message.instructions.forEach(instruction => {
                            if (instruction.program === 'spl-token' && instruction.parsed) {
                                transfers.push({
                                    mint: instruction.parsed.info.mint || 'unknown',
                                    tokenAmount: instruction.parsed.info.tokenAmount || { amount: '0', decimals: 0, uiAmount: 0 },
                                    sender: instruction.parsed.info.authority || instruction.parsed.info.source || 'unknown',
                                    receiver: instruction.parsed.info.destination || 'unknown',
                                    type: 'instruction',
                                    instructionType: instruction.parsed.type
                                });
                            }
                        });
                    }
                    
                    // Debug specific transaction
                    if (tx.signature === '55WzR4x1K6uia2V2CyS45nKcknsCGwMLDy7ap2Max2nA93kmakjbzap21zRDseUzv57LLegstKS2jUtsXRwMRUaA') {
                        console.log('[DEBUG] Target transaction final transfers:', {
                            signature: tx.signature,
                            transfersCount: transfers.length,
                            transfers: transfers
                        });
                    }
                    
                    return {
                        signature: tx.signature,
                        slot: tx.slot,
                        timestamp: tx.timestamp,
                        fee: tx.fee,
                        status: tx.status,
                        tokenTransfers: transfers
                    };
                })
                .filter(tx => tx.tokenTransfers.length > 0); // Only include transactions with actual transfers
            if (tokenTransfers.length > 0) {
                console.log(`[HELIUS] Page ${pageCount + 1}: Found ${tokenTransfers.length} token transfer transactions`);
            }
            allTransfers.push(...tokenTransfers);
            // Pagination: set 'before' to the last signature
            before = data[data.length - 1].signature;
            pageCount++;
        } catch (error) {
            console.error('Error fetching from Helius API:', error.response?.data || error.message);
            throw new Error(`Helius API error: ${error.response?.data?.error || error.message}`);
        }
    }
    console.log(`[HELIUS] Completed: Checked ${pageCount} pages, found ${allTransfers.length} token transfer transactions total`);
    return {
        success: true,
        address: solana_address,
        totalTransfers: allTransfers.length,
        transfers: allTransfers
    };
}

async function getTokenAccountBalance(data) {
    console.log("\n=== New Token Account Balance Request Received ===");
    
    const { 
        solana_address,
        token_mint_address
    } = data;

    if (!solana_address || !token_mint_address) {
        console.error('Missing required fields: solana_address or token_mint_address');
        throw new Error('Solana address and token mint address are required');
    }

    try {
        const publicKey = new PublicKey(solana_address);
        const mintPublicKey = new PublicKey(token_mint_address);

        // Get token account info
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            mint: mintPublicKey
        });

        if (tokenAccounts.value.length === 0) {
            return {
                success: true,
                address: solana_address,
                mint: token_mint_address,
                balance: 0,
                decimals: 0
            };
        }

        const tokenAccount = tokenAccounts.value[0];
        const accountInfo = tokenAccount.account.data.parsed.info;
        
        return {
            success: true,
            address: solana_address,
            mint: token_mint_address,
            balance: accountInfo.tokenAmount.uiAmount,
            decimals: accountInfo.tokenAmount.decimals,
            accountAddress: tokenAccount.pubkey.toBase58()
        };

    } catch (error) {
        console.error('Error fetching token account balance:', error);
        throw error;
    }
}

async function getTokenTransferHistory(data) {
    console.log("\n=== New Token Transfer History Request Received ===");
    
    const { 
        solana_address,
        days = 30
    } = data;

    if (!solana_address) {
        console.error('Missing required field: solana_address');
        throw new Error('Solana address is required');
    }

    try {
        const publicKey = new PublicKey(solana_address);
        const now = Date.now() / 1000;
        const daysAgo = now - (days * 24 * 60 * 60);

        // Get signatures from the last N days
        const signatures = await connection.getSignaturesForAddress(publicKey, {
            limit: 20000, // Get more to filter by date
            before: undefined
        });

        // Filter by date
        const recentSignatures = signatures.filter(sig => 
            sig.blockTime && sig.blockTime >= daysAgo
        );

        console.log(`Found ${recentSignatures.length} transactions in the last ${days} days`);

        // Get transaction details for recent signatures
        const transactions = await Promise.all(
            recentSignatures.map(async (sig) => {
                try {
                    const tx = await connection.getParsedTransaction(sig.signature, {
                        maxSupportedTransactionVersion: 0
                    });
                    return {
                        signature: sig.signature,
                        blockTime: sig.blockTime,
                        transaction: tx
                    };
                } catch (error) {
                    return null;
                }
            })
        );

        // Filter out failed transactions and extract token transfers
        const validTransactions = transactions.filter(tx => tx && tx.transaction);
        const tokenTransfers = [];

        for (const tx of validTransactions) {
            if (tx.transaction.transaction.message.instructions) {
                for (const instruction of tx.transaction.transaction.message.instructions) {
                    if (instruction.program === 'spl-token' && instruction.parsed) {
                        const transfer = {
                            signature: tx.signature,
                            blockTime: tx.blockTime,
                            type: instruction.parsed.type,
                            info: instruction.parsed.info,
                            slot: tx.transaction.slot
                        };
                        tokenTransfers.push(transfer);
                    }
                }
            }
        }

        return {
            success: true,
            address: solana_address,
            days: days,
            totalTransactions: transactions.length,
            totalTransfers: tokenTransfers.length,
            transfers: tokenTransfers
        };

    } catch (error) {
        console.error('Error fetching token transfer history:', error);
        throw error;
    }
}

module.exports = {
    getSolanaTokenTransfers,
    getTokenAccountBalance,
    getTokenTransferHistory,
    debugTransaction
};

// Debug function to investigate specific transactions
async function debugTransaction(signature) {
    if (!HELIUS_API_KEY) throw new Error('Helius API key is required');
    
    const url = `https://api.helius.xyz/v0/transactions/?api-key=${HELIUS_API_KEY}`;
    
    try {
        const { data } = await axios.post(url, {
            transactions: [signature]
        });
        
        if (data && data.length > 0) {
            const tx = data[0];
            console.log(`[DEBUG] Transaction ${signature}:`, {
                hasTokenTransfers: !!(tx.tokenTransfers && tx.tokenTransfers.length > 0),
                tokenTransfersCount: tx.tokenTransfers?.length || 0,
                hasInstructions: !!(tx.transaction && tx.transaction.message && tx.transaction.message.instructions),
                instructionCount: tx.transaction?.message?.instructions?.length || 0,
                hasMeta: !!(tx.meta && tx.meta.postTokenBalances),
                postTokenBalancesCount: tx.meta?.postTokenBalances?.length || 0,
                preTokenBalancesCount: tx.meta?.preTokenBalances?.length || 0,
                status: tx.status,
                slot: tx.slot,
                timestamp: tx.timestamp
            });
            
            if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
                console.log(`[DEBUG] Token transfers:`, tx.tokenTransfers);
            }
            
            if (tx.meta && tx.meta.postTokenBalances) {
                console.log(`[DEBUG] Post token balances:`, tx.meta.postTokenBalances);
            }
            
            if (tx.transaction && tx.transaction.message && tx.transaction.message.instructions) {
                const splInstructions = tx.transaction.message.instructions.filter(inst => 
                    inst.program === 'spl-token' || 
                    inst.programId === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
                );
                console.log(`[DEBUG] SPL token instructions:`, splInstructions);
            }
        }
        
        return data;
    } catch (error) {
        console.error('Error debugging transaction:', error.response?.data || error.message);
        throw error;
    }
}
