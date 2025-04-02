import updateUI from "./UpdateUI.tsx";
import { 
    Connection,} from "@solana/web3.js";
import { HELIUS_API_KEY } from '../../../env.ts';
  
  const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
  const connection = new Connection(RPC);

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function verifyTransaction(transactionId: any, dispatch: Function, type: String) {
    if (transactionId) {
      let transactionConfirmed = false
      for (let attempt = 1; attempt <= 3 && !transactionConfirmed; attempt++) {
        try {
          const confirmation = await connection.confirmTransaction(transactionId, 'confirmed');
          console.log('got confirmation', confirmation, 'on attempt', attempt);
          if (confirmation && confirmation.value && confirmation.value.err === null) {
            console.log(`Transaction successful: https://solscan.io/tx/${transactionId}`);
            updateUI(dispatch, type, 'Success')
            return true;
          }
          } catch (error) {
            console.error('Error sending transaction or in post-processing:', error, 'on attempt', attempt);
          }
          if (!transactionConfirmed) {
            await delay(1000); // Delay in milliseconds
          }
        }
        console.log("Transaction Uncomfirmed");
        updateUI(dispatch, type, 'Fail')
        return false
    } else {
      console.log("Transaction Failed: transactionID: ", transactionId);
      updateUI(dispatch, type, 'Fail')
      return false;
    }
  }

export default verifyTransaction;