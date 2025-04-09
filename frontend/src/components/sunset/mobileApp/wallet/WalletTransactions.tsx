import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import bankIcon from '../../../assets/bankIcon.png'
import LoadingAnimation from '../../LoadingAnimation.tsx';
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import bs58 from 'bs58';

function WalletTransactions() {
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const db = getFirestore();
    const [transactions, setTransactions] = useState<Transaction[]>([]); // Use the Transaction type here
    const [transactionsLoaded, setTransactionsLoaded] = useState(false);
    const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';
    const connection = new Connection(QUICKNODE_RPC);

    interface Transaction {
        id: string;
        from: string;
        to: string;
        fee: number;
        amount: number | null;
        tokenName: string | null;  // Ensure it's not optional
        timestamp: string;
    };

    interface CompiledInstruction {
        programIdIndex: number;  // Index of the program account in the account keys array
        accounts: number[];     // Indexes into the account keys array for accounts involved in this instruction
        data: string;           // Encoded instruction data
      }

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!publicKey) return;
            if (transactionsLoaded) return;

            console.log("Fetching transactions for public key:", publicKey);
            try {
                const signatureInfos = await connection.getSignaturesForAddress(new PublicKey(publicKey));
                console.log("Signatures received:", signatureInfos.length);

                const transactionPromises = signatureInfos.map(info => fetchTransaction(info.signature));
                const results = await Promise.all(transactionPromises);
                const filteredTransactions = results.filter((t): t is Transaction => t !== null);
                setTransactions(filteredTransactions);
                setTransactionsLoaded(true);
                console.log("Filtered transactions:", filteredTransactions);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setTransactionsLoaded(true);
            }
        };

        fetchTransactions();
    }, [publicKey, connection, transactionsLoaded]);

    const fetchTransaction = async (signature: string) => {
        console.log('running fetchTransaction')
        let retries = 5;
        let delayMs = 2000;
    
        for (let i = 0; i < retries; i++) {
            try {
                const transactionDetail = await connection.getTransaction(signature, { commitment: "finalized" });
                if (transactionDetail && transactionDetail.meta && transactionDetail.transaction) {
                    const instructions = transactionDetail.transaction.message.instructions;
                    let amount: number | null = null;
                    let tokenName: string | null = null;
                    let from: string | null = null;
                    let to: string | null = null;
    
                    for (let instruction of instructions) {
                        const programId = new PublicKey(transactionDetail.transaction.message.accountKeys[instruction.programIdIndex]);
                        if (programId.equals(TOKEN_PROGRAM_ID)) {
                            // Decode the SPL Token instruction
                            const accountKeys = transactionDetail.transaction.message.accountKeys;
                            const accounts = instruction.accounts;
                            
                            if (accounts.length >= 2) {
                                from = accountKeys[accounts[0]].toString();  // Sender's token account
                                to = accountKeys[accounts[1]].toString();    // Receiver's token account
    
                                const data = instruction.data;
                                const decodedData = bs58.decode(data);
                                const dataView = new DataView(decodedData.buffer);
                    
                                // Read the 32-bit unsigned integer at offset 1 in little-endian format
                                const rawAmount = dataView.getUint32(1, true); 

                                if (isNaN(rawAmount)) {
                                    amount = 1.0
                                } else {
                                    amount = rawAmount/10/10/10/10/10/10
                                }
                                //tokenName = parsedData.info.mint;
                                tokenName = 'USD'
                                /*
                                const tokenAccountInfo = await connection.getParsedAccountInfo(new PublicKey(to), "processed");
                                if (tokenAccountInfo.value && 'parsed' in tokenAccountInfo.value.data) {
                                    const parsedData = tokenAccountInfo.value.data.parsed;
                                    console.log('parsedData.info.decimals', parsedData.info.decimals);
                                    amount = rawAmount / Math.pow(10, parsedData.info.decimals); // Adjust based on token decimals
                                    if (isNaN(amount)) {
                                        amount = rawAmount/10/10/10/10/10/10
                                    }
                                    if (isNaN(rawAmount)) {
                                        amount = 1.0
                                    }
                                    tokenName = parsedData.info.mint;
                                }
                                    */

                                break;
                            }
                        }
                    }
    
                    return {
                        id: signature,
                        from,
                        to,
                        fee: Math.abs(transactionDetail.meta.preBalances[0] - transactionDetail.meta.postBalances[0]) / 1000000000,
                        amount,
                        tokenName,
                        timestamp: transactionDetail.blockTime ? new Date(transactionDetail.blockTime * 1000).toISOString() : 'Unknown'
                    };
                }
            } catch (error: any) {
                if (error.status === 429 && i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    delayMs *= 2;
                    continue;
                }
                console.error("Failed to fetch transaction for signature:", signature, "; Error:", error);
                return null;
            }
        }
        return null;
    };

    return (
        <div>
            {!transactionsLoaded ? (
<div style={{marginTop: window.innerHeight < 700 ? '30px' : '50px'}}>
    <LoadingAnimation/>
</div>

            ) : (
                <div style={{marginTop: '30px'}}>
                {transactions.length == 0 ? (
                    <div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                        <img src={bankIcon} style={{marginTop: '100px', width: '200px', height: 'auto'}}/>
                        <div style={{fontSize: '20px', marginTop: '30px', color: '#777777'}}>No Transactions Yet</div>
                        </div>
    
    
                    </div>
                ) : (
                    <div>
                {transactions.map((transaction) => (

                    
<div key={transaction.id} style={{ paddingTop: '20px' }}>
<div style={{display: 'flex', alignItems: 'center', justifyContent:'center'}}>
<hr style={{height: '1px', backgroundColor: '#999999', border: 'none', width: '85vw', 
maxWidth: '550px', marginTop: '-10px'}}></hr>
</div>

    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {/* 
    <div style={{width: '140px'}}>
        {transaction.from == publicKey ? (
            <div style={{color: '#7E0000'}}>Sent</div>
        ) : (
            <div style={{color: '#007E0D'}}>Received</div>
        )}
    </div>
    */}
    <div style={{width: '140px', fontWeight: 'bold'}}>
        ${transaction.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>

    {transaction.tokenName == 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' && (
        <div style={{}}>
            USDC
        </div>
    )}
    {transaction.tokenName == 'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6' && (
        <div style={{}}>
            USDY
        </div>
    )}
    {transaction.tokenName == '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo' && (
        <div style={{}}>
            PYUSD
        </div>
    )}
    {transaction.tokenName == 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' && (
        <div style={{}}>
            USDT
        </div>
    )}

    </div>

    <div style={{display: 'flex', alignItems: 'center', 
        justifyContent: 'center', flexDirection: 'column', 
        marginTop: '10px',
        gap: '10px'}}>

    {transaction.from == publicKey ? (
            <div style={{color: '#000000', fontSize: '12px'}}>{transaction.to}</div>
        ) : (
            <div style={{color: '#000000', fontSize: '12px'}}>{transaction.from}</div>
        )}

    <div style={{display: 'flex', justifyContent: 'space-around', 
        maxWidth: '400px',
        color: '#777777',
        gap: '10px'}}>
    <div style={{whiteSpace: 'nowrap'}}>{new Date(transaction.timestamp).toLocaleString([], { year: 'numeric', 
        month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>

<div>
        Fee: {transaction.fee} SOL
    </div>
    </div>

    </div>
</div>
))}
    
                    </div>
                )}
    
            </div>
            )}

        </div>
    );
}

export default WalletTransactions;