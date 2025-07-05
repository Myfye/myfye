import { 
  ComputeBudgetProgram, 
  PublicKey, 
  Connection, 
  Keypair, 
  LAMPORTS_PER_SOL, 
  sendAndConfirmTransaction, 
  SystemProgram, 
  Transaction, 
  TransactionInstruction,
  VersionedTransaction, } from "@solana/web3.js";
import { HELIUS_API_KEY, MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '../env';
import {
    USDC_MINT_ADDRESS,
    USDT_MINT_ADDRESS,
    USDY_MINT_ADDRESS,
    PYUSD_MINT_ADDRESS,
    EURC_MINT_ADDRESS,
    BTC_MINT_ADDRESS,
    WSOL_MINT_ADDRESS,
    XRP_MINT_ADDRESS,
    DOGE_MINT_ADDRESS,
    SUI_MINT_ADDRESS,
    AAPL_MINT_ADDRESS,
    ABT_MINT_ADDRESS,
    ABBV_MINT_ADDRESS,
    ACN_MINT_ADDRESS,
    GOOGL_MINT_ADDRESS,
    AMZN_MINT_ADDRESS,
    AMBR_MINT_ADDRESS,
    APP_MINT_ADDRESS,
    AZN_MINT_ADDRESS,
    BAC_MINT_ADDRESS,
    BRK_MINT_ADDRESS,
    AVGO_MINT_ADDRESS,
    CVX_MINT_ADDRESS,
    CRCL_MINT_ADDRESS,
    CSCO_MINT_ADDRESS,
    KO_MINT_ADDRESS,
    COIN_MINT_ADDRESS,
    CMCSA_MINT_ADDRESS,
    CRWD_MINT_ADDRESS,
    DHR_MINT_ADDRESS,
    DFDV_MINT_ADDRESS,
    LLY_MINT_ADDRESS,
    XOM_MINT_ADDRESS,
    GME_MINT_ADDRESS,
    GLD_MINT_ADDRESS,
    GS_MINT_ADDRESS,
    HD_MINT_ADDRESS,
    HON_MINT_ADDRESS,
    INTC_MINT_ADDRESS,
    IBM_MINT_ADDRESS,
    JNJ_MINT_ADDRESS,
    JPM_MINT_ADDRESS,
    LIN_MINT_ADDRESS,
    MRVL_MINT_ADDRESS,
    META_MINT_ADDRESS,
    MCD_MINT_ADDRESS,
    MDT_MINT_ADDRESS,
    MRK_MINT_ADDRESS,
    MSFT_MINT_ADDRESS,
    MSTR_MINT_ADDRESS,
    QQQ_MINT_ADDRESS,
    NFLX_MINT_ADDRESS,
    NVO_MINT_ADDRESS,
    NVDA_MINT_ADDRESS,
    ORCL_MINT_ADDRESS,
    PLTR_MINT_ADDRESS,
    PEP_MINT_ADDRESS,
    PFE_MINT_ADDRESS,
    PM_MINT_ADDRESS,
    PG_MINT_ADDRESS,
    HOOD_MINT_ADDRESS,
    CRM_MINT_ADDRESS,
    SPY_MINT_ADDRESS,
    TSLA_MINT_ADDRESS,
    TMO_MINT_ADDRESS,
    TQQQ_MINT_ADDRESS,
    UNH_MINT_ADDRESS,
    VTI_MINT_ADDRESS,
    V_MINT_ADDRESS,
    WMT_MINT_ADDRESS,
    MA_MINT_ADDRESS,
  } from "./MintAddress";

async function ensureTokenAccount(userPublicKeyString: String, mintAddress: String) {

    let programId: string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'

    // Check for stock mint addresses that need the different program ID
    switch (mintAddress) {
        case AAPL_MINT_ADDRESS:
        case ABT_MINT_ADDRESS:
        case ABBV_MINT_ADDRESS:
        case ACN_MINT_ADDRESS:
        case GOOGL_MINT_ADDRESS:
        case AMZN_MINT_ADDRESS:
        case AMBR_MINT_ADDRESS:
        case APP_MINT_ADDRESS:
        case AZN_MINT_ADDRESS:
        case BAC_MINT_ADDRESS:
        case BRK_MINT_ADDRESS:
        case AVGO_MINT_ADDRESS:
        case CVX_MINT_ADDRESS:
        case CRCL_MINT_ADDRESS:
        case CSCO_MINT_ADDRESS:
        case KO_MINT_ADDRESS:
        case COIN_MINT_ADDRESS:
        case CMCSA_MINT_ADDRESS:
        case CRWD_MINT_ADDRESS:
        case DHR_MINT_ADDRESS:
        case DFDV_MINT_ADDRESS:
        case LLY_MINT_ADDRESS:
        case XOM_MINT_ADDRESS:
        case GME_MINT_ADDRESS:
        case GLD_MINT_ADDRESS:
        case GS_MINT_ADDRESS:
        case HD_MINT_ADDRESS:
        case HON_MINT_ADDRESS:
        case INTC_MINT_ADDRESS:
        case IBM_MINT_ADDRESS:
        case JNJ_MINT_ADDRESS:
        case JPM_MINT_ADDRESS:
        case LIN_MINT_ADDRESS:
        case MRVL_MINT_ADDRESS:
        case META_MINT_ADDRESS:
        case MCD_MINT_ADDRESS:
        case MDT_MINT_ADDRESS:
        case MRK_MINT_ADDRESS:
        case MSFT_MINT_ADDRESS:
        case MSTR_MINT_ADDRESS:
        case QQQ_MINT_ADDRESS:
        case NFLX_MINT_ADDRESS:
        case NVO_MINT_ADDRESS:
        case NVDA_MINT_ADDRESS:
        case ORCL_MINT_ADDRESS:
        case PLTR_MINT_ADDRESS:
        case PEP_MINT_ADDRESS:
        case PFE_MINT_ADDRESS:
        case PM_MINT_ADDRESS:
        case PG_MINT_ADDRESS:
        case HOOD_MINT_ADDRESS:
        case CRM_MINT_ADDRESS:
        case SPY_MINT_ADDRESS:
        case TSLA_MINT_ADDRESS:
        case TMO_MINT_ADDRESS:
        case TQQQ_MINT_ADDRESS:
        case UNH_MINT_ADDRESS:
        case VTI_MINT_ADDRESS:
        case V_MINT_ADDRESS:
        case WMT_MINT_ADDRESS:
        case MA_MINT_ADDRESS:
            programId = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
            break;
        default:
            // Use default program ID for crypto tokens (USDC, USDT, etc.)
            break;
    }

    const userPublicKey = new PublicKey(userPublicKeyString);

    const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
    const connection = new Connection(RPC);

    const receiverParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
        userPublicKey,
        { programId: new PublicKey(programId) }
    );

    let receiverAccountInfo: any = receiverParsedTokenAccounts.value.find(
        (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === mintAddress
    );

    if (!receiverAccountInfo) {
    
        try {
            const response = await fetch(`${MYFYE_BACKEND}/create_solana_token_account`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': MYFYE_BACKEND_KEY,
                },
                body: JSON.stringify({
                    receiverPubKey: userPublicKeyString,
                    mintAddress: mintAddress,
                    programId: programId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend error:", errorData);
                throw new Error(`Backend error: ${errorData.error || 'Unknown error'}`);
            }

            const result = await response.json();
            console.log("Token account creation result:", result);

            // the create new account promise is not working 
            // on the backend so try waiting 10 seconds and then 
            // search for it again

            let attempts = 0;
            const maxAttempts = 10;
            
            while (attempts < maxAttempts) {
                console.log("Looking for newly created token account (Attempt " + (attempts + 1) + ")");
                
                await new Promise(resolve => setTimeout(resolve, 8000)); // Wait 8 seconds
            
                const receiverParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
                    userPublicKey,
                    { programId: new PublicKey(programId) }
                );
            
                receiverAccountInfo = receiverParsedTokenAccounts.value.find(
                    (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => 
                        accountInfo.account.data.parsed.info.mint === mintAddress
                );
            
                if (receiverAccountInfo) {
                    console.log(userPublicKey + " account found.");
                    return;
                }
            
                attempts++;
            }
            
            if (!receiverAccountInfo) {
                throw new Error("Token account not found after 10 attempts.");
            }

        } catch (error) {
            console.error("Failed to create or fetch the token account:", error);
            return false;
        }
    } else {
        console.log(" account found");
        return false;
    }
}

export default ensureTokenAccount;