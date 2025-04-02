import { useDispatch } from 'react-redux';
import { getFirestore, collection, addDoc, setDoc, getDoc, doc, getDocs, query, where, } from 'firebase/firestore';


const getUserTransactionsEnabled = async (userID: string): Promise<boolean> => {
    try {
        const db = getFirestore();
      const pubKeyDocRef = doc(db, 'DisabledUserIDs', 'DisabledUserIDs');
      const docSnapshot = await getDoc(pubKeyDocRef);
  
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const idsArray = data?.DisabledUserIDsArray || [];
  
        console.log(userID, "is in disabled: ", !idsArray.includes(userID))
        // Check if the userID is in the DisabledUserIDsArray
        return !idsArray.includes(userID); // Return true if the user is enabled (not in the disabled list)
      } else {
        console.log('Document does not exist.');
        return true; // Assume enabled if the document does not exist
      }
    } catch (error) {
      console.error("Error fetching user transaction enable status: ", error);
      return true; // Return true (enabled) in case of an error
    }
  };

export default getUserTransactionsEnabled