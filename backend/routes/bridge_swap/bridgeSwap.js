const {
  transfer_from_solana,
} = require("./transfer_from_solana/transferFromSolana");
const { transfer_from_base } = require("./transfer_from_base/transferFromBase");

async function bridge_swap(data) {
  if (data.inChain === "solana") {
    await transfer_from_solana(data);
  }
  if (data.inChain === "base") {
    await transfer_from_base(data);
  }
}

// Export functions for use in other modules
module.exports = {
  bridge_swap,
};
