// import { ArrowDown } from "@phosphor-icons/react";

// import { css } from "@emotion/react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import Avatar from "@/components/ui/avatar/Avatar";
// import { AbstractedAsset } from "@/features/assets/types";
// import { User } from "@/features/users/types";
// import { PayTransaction } from "@/features/pay/types";
// import { SendTransaction } from "@/features/send/types";

// const AssetSection = ({
//   abstractedAsset,
//   formattedUsdAmount,
// }: {
//   abstractedAsset: AbstractedAsset | null;
//   formattedUsdAmount: string;
// }) => {
//   return (
//     <div
//       css={css`
//         display: grid;
//         grid-template-columns: 1fr auto;
//         line-height: var(--line-height-tight);
//       `}
//     >
//       <div
//         css={css`
//           display: flex;
//           align-items: center;
//           gap: var(--size-150);
//         `}
//       >
//         <div
//           css={css`
//             width: 2.75rem;
//             border-radius: var(--border-radius-circle);
//             overflow: hidden;
//           `}
//         >
//           <img src={abstractedAsset?.icon.content} alt="" />
//         </div>
//         <p className="heading-small">{abstractedAsset?.label}</p>
//       </div>
//       <div
//         css={css`
//           align-content: center;
//           text-align: end;
//         `}
//       >
//         <p className="heading-small">{formattedUsdAmount}</p>
//       </div>
//     </div>
//   );
// };

// const UserSection = ({ user }: { user: User }) => {
//   return (
//     <div
//       css={css`
//         display: grid;
//         grid-template-columns: 1fr auto;
//         line-height: var(--line-height-tight);
//       `}
//     >
//       <div
//         css={css`
//           display: flex;
//           align-items: center;
//           gap: var(--size-150);
//         `}
//       >
//         <div
//           css={css`
//             width: 2.75rem;
//             border-radius: var(--border-radius-circle);
//             overflow: hidden;
//           `}
//         >
//           <Avatar />
//         </div>
//         <p className="heading-small">
//           {user?.first_name || user?.email || user?.phone_number}
//         </p>
//         {user?.first_name && <p>{user?.email || user?.phone_number}</p>}
//       </div>
//     </div>
//   );
// };

// const PaySummary = ({
//   transaction,
// }: {
//   transaction: PayTransaction | SendTransaction;
// }) => {
//   return (
//     <div
//       className="swap-coin-status"
//       css={css`
//         display: flex;
//         flex-direction: column;
//         gap: var(--size-200);
//         background-color: var(--clr-surface-raised);
//         box-shadow: var(--box-shadow-card);
//         padding: var(--size-200);
//         border-radius: var(--border-radius-medium);
//       `}
//     >
//       <section>
//         {transaction.type === "send" ? (
//           <AssetSection abstractedAssetId={"us_dollar_yield"} amount={0} />
//         ) : (
//           <UserSection user={transaction.user}></UserSection>
//         )}
//       </section>
//       <section
//         className="icon-wrapper"
//         css={css`
//           padding-inline-start: 0.675rem;
//         `}
//       >
//         <ArrowDown color="var(--clr-icon)" size={20} />
//       </section>
//       <section>
//         {transaction.type === "send" ? (
//           <UserSection user={transaction.user}></UserSection>
//         ) : (
//           <AssetSection abstractedAssetId={"us_dollar_yield"} amount={0} />
//         )}
//       </section>
//     </div>
//   );
// };

// export default PaySummary;
