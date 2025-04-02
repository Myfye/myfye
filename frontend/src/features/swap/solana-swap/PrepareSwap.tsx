import { 
    PublicKey, 
    Connection,
    VersionedTransaction,
    AddressLookupTableAccount,
    TransactionInstruction,
    TransactionMessage } from "@solana/web3.js";
import { HELIUS_API_KEY } from '../../../env.ts';
const SERVER_SOLANA_PUBLIC_KEY = import.meta.env.VITE_REACT_APP_SERVER_SOLANA_PUBLIC_KEY;

const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const connection = new Connection(RPC);


async function prepareTransaction(instructions: any) {

    try {
        const {
        computeBudgetInstructions, // The necessary instructions to setup the compute budget.
        setupInstructions, // Setup missing ATA for the users.
        swapInstruction: swapInstructionPayload, // The actual swap instruction.
        cleanupInstruction, // Unwrap the SOL if `wrapAndUnwrapSol = true`.
        addressLookupTableAddresses, // The lookup table addresses that you can use if you are using versioned transaction.
        } = instructions;

        const deserializeInstruction = (instruction: any) => {
            const deserializedInstruction = new TransactionInstruction({
              programId: new PublicKey(instruction.programId),
              keys: instruction.accounts.map((key: any) => ({
                pubkey: new PublicKey(key.pubkey),
                isSigner: key.isSigner,
                isWritable: key.isWritable,
              })),
              data: Buffer.from(instruction.data, "base64"),
            });
            
            // Log each instruction as it's deserialized
            console.log(`Deserialized instruction for program: ${instruction.programId}`);
            return deserializedInstruction;
          };

    
        // Get lookup table accounts
        const getAddressLookupTableAccounts = async (
        keys: string[]
        ): Promise<AddressLookupTableAccount[]> => {
        const addressLookupTableAccountInfos =
            await connection.getMultipleAccountsInfo(
            keys.map((key) => new PublicKey(key))
            );
        
        return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
            const addressLookupTableAddress = keys[index];
            if (accountInfo) {
            const addressLookupTableAccount = new AddressLookupTableAccount({
                key: new PublicKey(addressLookupTableAddress),
                state: AddressLookupTableAccount.deserialize(accountInfo.data),
            });
            acc.push(addressLookupTableAccount);
            }
        
            return acc;
        }, new Array<AddressLookupTableAccount>());
        };
    
        // Get lookup table accounts
        const addressLookupTableAccounts = await getAddressLookupTableAccounts(
            addressLookupTableAddresses
        );

        // Get latest blockhash
        const blockhash = (await connection.getLatestBlockhash()).blockhash;
    
        const allInstructions = [
            ...(computeBudgetInstructions?.map(deserializeInstruction) || []),
            ...(setupInstructions?.map(deserializeInstruction) || []),
            deserializeInstruction(swapInstructionPayload),
            ...(cleanupInstruction ? [deserializeInstruction(cleanupInstruction)] : []),
          ];
      
          // Log instruction order
          allInstructions.forEach((inst, idx) => {
            console.log(`Instruction ${idx} program: ${inst.programId.toString()}`);
          });

          
          const messageV0 = new TransactionMessage({
            payerKey: new PublicKey(SERVER_SOLANA_PUBLIC_KEY!),
            recentBlockhash: blockhash,
            instructions: allInstructions,
          }).compileToV0Message(addressLookupTableAccounts);
    
        const transaction = new VersionedTransaction(messageV0);

        console.log("Prepared transaction", transaction);
        return transaction;
    } catch (error) {
        console.error("Error preparing transaction:", error);
        throw error;
    }
}

export default prepareTransaction;