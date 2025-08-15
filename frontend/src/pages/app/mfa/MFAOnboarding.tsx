import { useSelector } from "react-redux";
import {
  usePrivy,
  useMfaEnrollment,
  useSetWalletRecovery,
} from "@privy-io/react-auth";
import { useCreateWallet } from "@privy-io/react-auth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { motion } from "motion/react";

const MFAOnboarding = () => {
  const { showMfaEnrollmentModal } = useMfaEnrollment();
  const { setWalletRecovery } = useSetWalletRecovery();
  const { createWallet } = useCreateWallet();

  const { user, linkPasskey } = usePrivy();

  const mfaStatus = useAppSelector((state) => state.userWalletData.mfaStatus);

  const isConfirmed = user?.wallet?.address?.startsWith("0x");

  const handlePasswordBackup = () => {
    createWallet();
    setWalletRecovery();
  };

  if (!isConfirmed) {
    return <motion.div></motion.div>;
  }
};
//   if (mfaStatus === "createdPasskey") {
//     return (
//       <div>
//         <div style={{ display: "flex", justifyContent: "center" }}>
//           <img
//             src={appLogo}
//             alt="appLogo"
//             style={{ width: "auto", height: "90px" }}
//           />
//         </div>
//         <div style={{ marginLeft: "20px", fontSize: "20px" }}>
//           Secure Your Account
//         </div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: "40px",
//             paddingTop: "30px",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "20px",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "25px",
//                 width: "40px",
//                 height: "40px",
//                 border: "2px solid transparent",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               1
//             </div>

//             <div style={{ textDecoration: "line-through", width: "200px" }}>
//               Back up with password
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "20px",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "25px",
//                 width: "40px",
//                 height: "40px",
//                 border: "3px solid transparent",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItem <div>
//                 <div style={{ marginLeft: "20px", fontSize: "20px" }}>
//                   Secure Your Account
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     gap: "40px",
//                     paddingTop: "30px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "20px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         fontSize: "25px",
//                         width: "40px",
//                         height: "40px",
//                         border: "2px solid #447E26",
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       1
//                     </div>

//                     <button
//                       onClick={handlePasswordBackup}
//                       style={{
//                         color: "#ffffff",
//                         fontSize: "15px",
//                         fontWeight: "bold",
//                         background: "#447E26",
//                         borderRadius: "10px",
//                         border: "3px solid #ffffff",
//                         padding: "10px",
//                         cursor: "pointer",
//                         width: "200px",
//                         textAlign: "center",
//                       }}
//                     >
//                       Back up with password
//                     </button>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "20px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         fontSize: "25px",
//                         width: "40px",
//                         height: "40px",
//                         border: "3px solid transparent",
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       2
//                     </div>
//                     <div onClick={linkPasskey} style={{ width: "200px" }}>
//                       Create A Passkey
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "20px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         fontSize: "25px",
//                         width: "40px",
//                         height: "40px",
//                         border: "3px solid transparent",
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       3
//                     </div>

//                     <button
//                       onClick={showMfaEnrollmentModal}
//                       style={{
//                         width: "200px",
//                         textAlign: "left",
//                       }}
//                     >
//                       Enroll in MFA
//                     </button>
//                   </div>
//                 </div>
//               </div>s: "center",
//                 justifyContent: "center",
//               }}
//             >
//               2
//             </div>
//             <div
//               onClick={linkPasskey}
//               style={{ textDecoration: "line-through", width: "200px" }}
//             >
//               Create A Passkey
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "20px",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "25px",
//                 width: "40px",
//                 height: "40px",
//                 border: "3px solid #447E26",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontWeight: "bold",
//               }}
//             >
//               3
//             </div>

//             <button
//               onClick={showMfaEnrollmentModal}
//               style={{
//                 color: "#ffffff",
//                 fontSize: "20px",
//                 fontWeight: "bold",
//                 background: "#447E26",
//                 borderRadius: "10px",
//                 border: "3px solid #ffffff",
//                 padding: "10px",
//                 cursor: "pointer",
//                 width: "200px",
//                 textAlign: "center",
//               }}
//             >
//               Enroll in MFA
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   if (mfaStatus === "" || !mfaStatus) {
//     return (
//       <div>
//         <div style={{ display: "flex", justifyContent: "center" }}>
//           <img
//             src={appLogo}
//             alt="appLogo"
//             style={{ width: "auto", height: "90px" }}
//           />
//         </div>
//         <div style={{ marginLeft: "20px", fontSize: "20px" }}>
//           Secure Your Account
//         </div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: "40px",
//             paddingTop: "30px",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "20px",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "25px",
//                 width: "40px",
//                 height: "40px",
//                 border: "2px solid transparent",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               1
//             </div>

//             <div style={{ textDecoration: "line-through", width: "200px" }}>
//               Back up with password
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "20px",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "25px",
//                 width: "40px",
//                 height: "40px",
//                 border: "3px solid #447E26",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontWeight: "bold",
//               }}
//             >
//               2
//             </div>
//             <button
//               onClick={linkPasskey}
//               style={{
//                 color: "#ffffff",
//                 fontSize: "20px",
//                 fontWeight: "bold",
//                 background: "#447E26",
//                 borderRadius: "10px",
//                 border: "3px solid #ffffff",
//                 padding: "10px",
//                 cursor: "pointer",
//                 width: "200px",
//               }}
//             >
//               Create A Passkey
//             </button>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "20px",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "25px",
//                 width: "40px",
//                 height: "40px",
//                 border: "3px solid transparent",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               3
//             </div>

//             <div style={{ width: "200px" }}>Enroll in MFA</div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// };

{
  /* <div>
<div style={{ marginLeft: "20px", fontSize: "20px" }}>
  Secure Your Account
</div>
<div
  style={{
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    gap: "40px",
    paddingTop: "30px",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
    }}
  >
    <div
      style={{
        fontSize: "25px",
        width: "40px",
        height: "40px",
        border: "2px solid #447E26",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
      }}
    >
      1
    </div>

    <button
      onClick={handlePasswordBackup}
      style={{
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: "bold",
        background: "#447E26",
        borderRadius: "10px",
        border: "3px solid #ffffff",
        padding: "10px",
        cursor: "pointer",
        width: "200px",
        textAlign: "center",
      }}
    >
      Back up with password
    </button>
  </div>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
    }}
  >
    <div
      style={{
        fontSize: "25px",
        width: "40px",
        height: "40px",
        border: "3px solid transparent",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      2
    </div>
    <div onClick={linkPasskey} style={{ width: "200px" }}>
      Create A Passkey
    </div>
  </div>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
    }}
  >
    <div
      style={{
        fontSize: "25px",
        width: "40px",
        height: "40px",
        border: "3px solid transparent",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      3
    </div>

    <button
      onClick={showMfaEnrollmentModal}
      style={{
        width: "200px",
        textAlign: "left",
      }}
    >
      Enroll in MFA
    </button>
  </div>
</div>
</div> */
}

export default MFAOnboarding;
