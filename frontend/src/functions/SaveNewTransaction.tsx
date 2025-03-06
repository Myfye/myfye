import { useDispatch } from 'react-redux';
import { getFirestore, collection, addDoc, setDoc, getDoc, doc } from 'firebase/firestore';


export const saveNewTransaction = async (
    pubKey: string, 
    amount: number, 
    type: string
    ): Promise<boolean> => {
    
    const db = getFirestore();
    const currentDateInSeconds = Date.now()/1000;

    const pubKeyDocRef = doc(db, 'pubKeys', pubKey);

    try {
        if (type == 'EarnDeposit') {
            let deposits: Record<string, number> = {};

            deposits[currentDateInSeconds] = amount;
    
            const updateDatabase = setDoc(pubKeyDocRef, {
                deposits: deposits
            }, { merge: true });
            await Promise.all([updateDatabase]);
        } else if (type == 'EarnWithdrawal') {
            let deposits: Record<string, number> = {};

            deposits[currentDateInSeconds] = amount;
    
            const updateDatabase = setDoc(pubKeyDocRef, {
                deposits: deposits
            }, { merge: true });
            await Promise.all([updateDatabase]);
        }

            
        return true;
    } catch {
        console.log('Error saving deposit to database');
        return false;
}

};








