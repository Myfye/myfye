import { 
    setSwapFXTransactionStatus,
    setSwapWithdrawTransactionStatus,
    setSwapDepositTransactionStatus
   } from '../../../redux/userWalletData.tsx';

function updateUI(dispatch: any, type: String, status: string): void {

    if (type == 'withdraw' ) {
      dispatch(setSwapWithdrawTransactionStatus(status)); // Update UI
    } else if (type == 'deposit') {
      dispatch(setSwapDepositTransactionStatus(status)); // Update UI
    } else {
      dispatch(setSwapFXTransactionStatus(status)); // Update UI
    }
  
  }

export default updateUI;