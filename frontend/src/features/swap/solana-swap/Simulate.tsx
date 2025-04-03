import { 
    Connection, } from "@solana/web3.js";
  import { HELIUS_API_KEY } from '../../../env.ts';

const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const connection = new Connection(RPC);


async function simulate(transaction: any) {

    const simulationResult = await connection.simulateTransaction(transaction);

    if (simulationResult.value.err) {
        console.log("Simulation failed:", simulationResult.value.err);
    } else {
        console.log("Simulation succeeded. Logs:", simulationResult.value.logs);
    }
}

export default simulate;