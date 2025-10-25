import React, { useState, useEffect } from "react";
import menuIcon from "../../assets/menuIcon.png";
import { useSelector } from "react-redux";
import { setSolanaPubKey } from "../../../redux/userWalletData.tsx";
import { useDispatch } from "react-redux";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { updateUserSolanaPubKey } from "./LoginService.tsx";
import getSolanaBalances from "../../../functions/GetSolanaBalances.tsx";

const PrivyUseSolanaWallets = () => {
  return <></>;
};

export default PrivyUseSolanaWallets;
