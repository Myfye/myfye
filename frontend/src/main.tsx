import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./redux/store.tsx";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";
import { PrivyProvider } from "@privy-io/react-auth";
import { StrictMode } from "react";
import { base } from "viem/chains";

const root = createRoot(document.getElementById("root")!);

const HELIUS_API_KEY = import.meta.env.VITE_REACT_APP_HELIUS_API_KEY;

root.render(
  <StrictMode>
    <PrivyProvider
      appId="cm4ucmtf8091nkywlgy9os418"
      config={{
        loginMethods: ["email"],
        appearance: {
          theme: "light",
          primaryColor: "#447E26",
          accentColor: "#117E3B",
          logo: "https://project-eli-lewitt.s3.us-west-2.amazonaws.com/logo512.png",
          walletChainType: "ethereum-and-solana",
        },
        embeddedWallets: {
          createOnLogin: "all-users",
          showWalletUIs: false,
        },
        solanaClusters: [
          {
            name: "mainnet-beta",
            rpcUrl: `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
          },
        ],
        defaultChain: base,
        supportedChains: [base],
      }}
    >
      <Provider store={store} children={<App />}></Provider>
    </PrivyProvider>
  </StrictMode>
);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env
    .VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { app, db, functions, HELIUS_API_KEY };
