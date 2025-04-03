const express = require("express");
const router = express.Router();

const getUserBalancesRoute = require("./routes/getUserBalances");

router.get("/get_balance", (req, res) => {
  const balance = {
    address: "YourWalletAddress",
    balance: "11",
  };
  res.json(balance);
});

module.exports = router;
