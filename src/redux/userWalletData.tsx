import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserWalletDataState {
  wallet: any,
  currentUserID: string;
  currentUserFirstName: string;
  currentUserLastName: string;
  currentUserEmail: string;
  isConnected: boolean;
  type: string;
  pubKey: string;
  totalInvestingValue: number,
  solBalance: number,
  usdcSolBalance: number,
  usdtSolBalance: number,
  pyusdSolBalance: number,
  eurcSolBalance: number,
  busdSolBalance: number,
  usdySolBalance: number,
  btcSolBalance: number,
  usdcEthBalance: number,
  usdtEthBalance: number,
  busdEthBalance: number,
  currentUserKYCVerified: boolean,
  swapWithdrawTransactionStatus: string,
  swapDepositTransactionStatus: string,
  swapFXTransactionStatus: string,
  updatingBalance: boolean,
  hotBalanceUSDY: number,
  shouldShowBottomNav: boolean,
  showPayPage: boolean,
  showContactsPage: boolean,
  showSendPage: boolean,
  showWithdrawStablecoinPage: boolean,
  showDepositStablecoinPage: boolean,
  showBanxaPopUp: boolean,
  showEarnPage: boolean,
  showCryptoPage: boolean,
  showWalletPage: boolean,
  showMainDepositPage: boolean,
  showAccountHistory: boolean,
  newUserHasPreviousBalance: boolean,
  showRequestPage: boolean,
  showProfileMenu: boolean,
  showSwapWithdrawPage: boolean,
  showSwapDepositPage: boolean,
  priceOfUSDYinUSDC: number,
  priceOfBTCinUSDC: number,
  priceOfEURCinUSDC: number,
  recentlyUsedSolanaAddresses: string[],
  showContactPopup: boolean,
  selectedLanguageCode: string,
  depositWithdrawProductType: string;
  passKeyState: string;
  privyWalletReady: boolean;
}

const initialUserWalletData: UserWalletDataState = {
  wallet: false,
  isConnected: false,
  type: '',
  pubKey: '',
  totalInvestingValue: 0,
  solBalance: 0,
  usdcSolBalance: 0,
  usdtSolBalance: 0,
  pyusdSolBalance: 0,
  eurcSolBalance: 0,
  btcSolBalance: 0,
  usdySolBalance: 0,
  busdSolBalance: 0,
  usdcEthBalance: 0,
  usdtEthBalance: 0,
  busdEthBalance: 0,
  currentUserKYCVerified: true, // true for Development, false for Deployment
  currentUserFirstName: '',
  currentUserLastName: '',
  currentUserEmail: '',
  swapWithdrawTransactionStatus: '',
  swapDepositTransactionStatus: '',
  swapFXTransactionStatus: '',
  updatingBalance: false,
  hotBalanceUSDY: 0,
  shouldShowBottomNav: true,
  showPayPage: false,
  showContactsPage: false,
  showSendPage: false,
  showWithdrawStablecoinPage: false,
  showBanxaPopUp: false,
  showDepositStablecoinPage: false,
  showCryptoPage: false,
  showEarnPage: false,
  showWalletPage: false,
  showMainDepositPage: false,
  showAccountHistory: false,
  newUserHasPreviousBalance: false,
  showRequestPage: false,
  showProfileMenu: false,
  showSwapWithdrawPage: false,
  showSwapDepositPage: false,
  priceOfUSDYinUSDC: 0,
  priceOfBTCinUSDC: 0,
  priceOfEURCinUSDC: 0,
  recentlyUsedSolanaAddresses: [],
  showContactPopup: false,
  selectedLanguageCode: '',
  currentUserID: '',
  depositWithdrawProductType: 'Earn',
  passKeyState: 'initial',
  privyWalletReady: false
};



export const userWalletDataSlice = createSlice({
  name: 'userWalletData',
  initialState: initialUserWalletData,
  reducers: {
    setWallet: (state, action: PayloadAction<any>) => {
      state.wallet = action.payload;
    },
    setWalletConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setWalletType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setWalletPubKey: (state, action: PayloadAction<string>) => {
      state.pubKey = action.payload;
    },
    settotalInvestingValue: (state, action: PayloadAction<number>) => {
      state.totalInvestingValue = action.payload;
    },
    setsolValue: (state, action: PayloadAction<number>) => {
      state.solBalance = action.payload;
    },
    setusdcSolValue: (state, action: PayloadAction<number>) => {
      state.usdcSolBalance = action.payload;
    },
    setusdtSolValue: (state, action: PayloadAction<number>) => {
      state.usdtSolBalance = action.payload;
    },
    setbusdSolValue: (state, action: PayloadAction<number>) => {
      state.busdSolBalance = action.payload;
    },
    setpyusdSolValue: (state, action: PayloadAction<number>) => {
      state.pyusdSolBalance = action.payload;
    },
    seteurcSolValue: (state, action: PayloadAction<number>) => {
      state.eurcSolBalance = action.payload;
    },
    setbtcSolValue: (state, action: PayloadAction<number>) => {
      state.btcSolBalance = action.payload;
    },
    setusdySolValue: (state, action: PayloadAction<number>) => {
      state.usdySolBalance = action.payload;
    },
    setusdcEthValue: (state, action: PayloadAction<number>) => {
      state.usdcEthBalance = action.payload;
    },
    setusdtEthValue: (state, action: PayloadAction<number>) => {
      state.usdtEthBalance = action.payload;
    },
    setbusdEthValue: (state, action: PayloadAction<number>) => {
      state.busdEthBalance = action.payload;
    },
    setCurrentUserKYCVerified: (state, action: PayloadAction<boolean>) => {
      state.currentUserKYCVerified = action.payload;
    },

    setcurrentUserID: (state, action: PayloadAction<string>) => {
      state.currentUserID = action.payload;
    },
  setcurrentUserFirstName: (state, action: PayloadAction<string>) => {
    state.currentUserFirstName = action.payload;
  },

  setcurrentUserLastName: (state, action: PayloadAction<string>) => {
    state.currentUserLastName = action.payload;
  },

  setcurrentUserEmail: (state, action: PayloadAction<string>) => {
    state.currentUserEmail = action.payload;
  },
  setSwapWithdrawTransactionStatus: (state, action: PayloadAction<string>) => {
    state.swapWithdrawTransactionStatus = action.payload;
  },
  setSwapDepositTransactionStatus: (state, action: PayloadAction<string>) => {
    state.swapDepositTransactionStatus = action.payload;
  },
  setSwapFXTransactionStatus: (state, action: PayloadAction<string>) => {
    state.swapFXTransactionStatus = action.payload;
  },
  setUpdatingBalance: (state, action: PayloadAction<boolean>) => {
    state.updatingBalance = action.payload;
  },
  setHotBalanceUSDY: (state, action: PayloadAction<number>) => {
    state.hotBalanceUSDY = action.payload;
  },
  setShouldShowBottomNav: (state, action: PayloadAction<boolean>) => {
    state.shouldShowBottomNav = action.payload;
  },
  setShowPayPage: (state, action: PayloadAction<boolean>) => {
    state.showPayPage = action.payload;
  },
  setShowContactsPage: (state, action: PayloadAction<boolean>) => {
    state.showContactsPage = action.payload;
  },
  setShowSendPage: (state, action: PayloadAction<boolean>) => {
    state.showSendPage = action.payload;
  },
  setShowRequestPage: (state, action: PayloadAction<boolean>) => {
    state.showRequestPage = action.payload;
  },
  setShowWithdrawStablecoinPage: (state, action: PayloadAction<boolean>) => {
    state.showWithdrawStablecoinPage = action.payload;
  },
  setShowBanxaPopUp: (state, action: PayloadAction<boolean>) => {
    state.showBanxaPopUp = action.payload;
  },
  setShowDepositStablecoinPage: (state, action: PayloadAction<boolean>) => {
    state.showDepositStablecoinPage= action.payload;
  },
  setShowEarnPage: (state, action: PayloadAction<boolean>) => {
    state.showEarnPage = action.payload;
  },
  setShowCryptoPage: (state, action: PayloadAction<boolean>) => {
    state.showCryptoPage = action.payload;
  },
  setShowWalletPage: (state, action: PayloadAction<boolean>) => {
    state.showWalletPage = action.payload;
  },
  setShowMainDepositPage: (state, action: PayloadAction<boolean>) => {
    state.showMainDepositPage = action.payload;
  },
  setShowAccountHistory: (state, action: PayloadAction<boolean>) => {
    state.showAccountHistory= action.payload;
  },
  setNewUserHasPreviousBalance: (state, action: PayloadAction<boolean>) => {
    state.newUserHasPreviousBalance = action.payload;
  },
  setShowProfileMenu: (state, action: PayloadAction<boolean>) => {
    state.showProfileMenu = action.payload;
  },
  setShowSwapWithdrawPage: (state, action: PayloadAction<boolean>) => {
    state.showSwapWithdrawPage = action.payload;
  },
  setShowSwapDepositPage: (state, action: PayloadAction<boolean>) => {
    state.showSwapDepositPage = action.payload;
  },
  setPriceOfUSDYinUSDC: (state, action: PayloadAction<number>) => {
    state.priceOfUSDYinUSDC = action.payload;
  },
  setPriceOfBTCinUSDC: (state, action: PayloadAction<number>) => {
    state.priceOfBTCinUSDC = action.payload;
  },
  setPriceOfEURCinUSDC: (state, action: PayloadAction<number>) => {
    state.priceOfEURCinUSDC = action.payload;
  },
  setRecentlyUsedSolanaAddresses: (state, action: PayloadAction<string[]>) => {
    state.recentlyUsedSolanaAddresses = action.payload;
  },
  setShowContactPopup: (state, action: PayloadAction<boolean>) => {
    state.showContactPopup = action.payload;
  },
  setSelectedLanguageCode: (state, action: PayloadAction<string>) => {
    state.selectedLanguageCode= action.payload;
  },
  setDepositWithdrawProductType: (state, action: PayloadAction<string>) => {
    state.depositWithdrawProductType= action.payload;
  },
  setPassKeyState: (state, action: PayloadAction<string>) => {
    state.passKeyState= action.payload;
  }, 
  setPrivyWalletReady: (state, action: PayloadAction<boolean>) => {
    state.privyWalletReady= action.payload;
  }, 
  },
});

export const { 
  setWallet, setWalletConnected, 
  setWalletType, setWalletPubKey,
  settotalInvestingValue,
  setsolValue, setusdcSolValue, setusdtSolValue, setpyusdSolValue, 
  seteurcSolValue, setbusdSolValue, setusdySolValue,
  setbtcSolValue,
  setusdcEthValue, setusdtEthValue, setbusdEthValue, 
  setCurrentUserKYCVerified,
  setcurrentUserFirstName, setcurrentUserLastName,
  setcurrentUserEmail, 
  setSwapWithdrawTransactionStatus,
  setSwapDepositTransactionStatus,
  setSwapFXTransactionStatus,
   setUpdatingBalance,
  setShouldShowBottomNav, setShowPayPage, setShowSendPage,
  setShowWithdrawStablecoinPage, setShowBanxaPopUp,
  setShowDepositStablecoinPage, setShowEarnPage, setShowCryptoPage,
  setShowWalletPage, setShowMainDepositPage, setShowAccountHistory,
  setNewUserHasPreviousBalance, setShowRequestPage,
  setShowProfileMenu, setShowSwapWithdrawPage,
  setShowSwapDepositPage, setHotBalanceUSDY,
  setPriceOfUSDYinUSDC, 
  setPriceOfBTCinUSDC,
  setPriceOfEURCinUSDC,
  setRecentlyUsedSolanaAddresses, 
  setShowContactPopup, setSelectedLanguageCode,
  setcurrentUserID, setDepositWithdrawProductType,
  setPassKeyState,
  setPrivyWalletReady
  
} = userWalletDataSlice.actions;

export default userWalletDataSlice.reducer;


