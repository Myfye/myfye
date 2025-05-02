import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import bankIcon from '../../../assets/bankIcon.png'
import LoadingAnimation from '../../LoadingAnimation.tsx';
import myfyeEarnGreen from '../../../assets/myfyeEarnGreen.png';

function EarnTransactions() {
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const db = getFirestore();
    const [transactions, setTransactions] = useState<Transaction[]>([]); // Use the Transaction type here
    const [transactionsLoaded, setTransactionsLoaded] = useState(false);
    const depositWithdrawProductType = useSelector((state: any) => state.userWalletData.depositWithdrawProductType);

    interface Transaction {
        id: string;
        type: string;
        time: string; // Adjust based on your actual timestamp object structure
        amount: number;
        publicKey: string;
        currency: string;
    }

    useEffect(() => {
        const fetchTransactions = async () => {
            const earnTransactionsRef = collection(db, 'earnTransactions');
            const q = query(earnTransactionsRef, where("publicKey", "==", publicKey));

            try {
                const querySnapshot = await getDocs(q);
                let items = querySnapshot.docs.map(doc => ({
                    ...doc.data() as Transaction, // Type assertion here
                    id: doc.id,
                }));
                if (depositWithdrawProductType === 'Earn') {
                    items = items.filter(item => item.type === 'deposit' || item.type === 'withdrawal');
                } else if (depositWithdrawProductType === 'Crypto') {
                    console.log("Filtering for crypto")
                    items = items.filter(item => item.type === 'cryptoDeposit' || item.type === 'cryptoWithdrawal');
                    console.log(items);
                }
                items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
                setTransactions(items);
                setTransactionsLoaded(true);
            } catch (error) {
                console.error("Error fetching transactions: ", error);
            }
        };

        if (publicKey) {
            console.log("fetching transaction")
            fetchTransactions();
        }
    }, [publicKey, depositWithdrawProductType]);

    return (
        <div>
            {!transactionsLoaded ? (
<div style={{marginTop: window.innerHeight < 700 ? '30px' : '50px'}}>
    <LoadingAnimation/>
</div>

            ) : (


                <div style={{marginTop: window.innerHeight < 700 ? '15px' : '30px'}}>

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<img style={{ width: '180px', height: 'auto'}}src={myfyeEarnGreen}/>
</div>



                {transactions.length == 0 ? (
                    <div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                        <img src={bankIcon} style={{marginTop: '100px', width: '200px', height: 'auto'}}/>
                        <div style={{fontSize: '20px', marginTop: '30px', color: '#777777'}}>No Deposits Yet</div>
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
                        <div style={{width: '140px'}}>
                            {transaction.type == 'deposit' || transaction.type == 'cryptoDeposit' ? (
                                <div style={{color: '#007E0D'}}>Deposit</div>
                            ) : (
                                <div style={{color: '#7E0000'}}>Withdrawal</div>
                            )}
                        </div>
                        <div style={{width: '140px', fontWeight: 'bold'}}>
                            ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div style={{whiteSpace: 'nowrap'}}>{new Date(transaction.time).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                        
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

export default EarnTransactions;