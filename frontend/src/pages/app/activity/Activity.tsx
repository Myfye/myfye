import Button from "@/shared/components/ui/button/Button";

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import transaction_list from "./transaction";
import { RootState } from "@/redux/store";
import ActivityList from "./activityList";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import { useLottie } from "lottie-react";

const Activity = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.kyc.modal.isOpen);

  const user_id = useSelector((state: RootState) => state.userWalletData.currentUserID);
  const solanaPubKey = useSelector((state: RootState) => state.userWalletData.solanaPubKey);
  //const solanaPubKey = "FG92wp6gSqSbh2n3UDWF1TYifmXbi8w37fEvdGTVWGXf";
  const evmPubKey = useSelector((state: RootState) => state.userWalletData.evmPubKey);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (user_id && evmPubKey && solanaPubKey) {
        try {
          setLoading(true);
          setError(null);
          const response = await transaction_list(user_id, evmPubKey, solanaPubKey);
          // Extract cleanedTransactions from the response
          if (response && response.cleanedTransactions) {
            setTransactions(response.cleanedTransactions);
          } else {
            setTransactions([]);
          }
        } catch (error) {
          console.error('Failed to fetch transaction history:', error);
          setError('Failed to load transaction history');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactionHistory();
  }, [user_id, evmPubKey, solanaPubKey]);

  return (
    <>
      <div
        className="wallet"
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100cqh;
          overflow-y: auto;
          background-color: var(--clr-surface);
          padding-block-end: var(--size-200);
        `}
      >
        <section>
        </section>

        <section
          css={css`
            flex: 1;
            margin-inline: var(--size-250);
            overflow-y: auto;
          `}
        >
          {loading && (
            <div
              css={css`
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 2rem;
                color: var(--clr-text-secondary);
              `}
            >
              <div
                css={css`
                  width: 12rem;
                  height: 12rem;
                `}
              >
                <LoadingAnimation />
              </div>
            </div>
          )}
          
          {error && (
            <div
              css={css`
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 2rem;
                color: var(--clr-error);
                text-align: center;
              `}
            >
              {error}
            </div>
          )}
          
          {!loading && !error && (
            <ActivityList transactions={transactions} />
          )}
        </section>
      </div>
    </>
  );
};

export default Activity;

const LoadingAnimation = () => {
  const options = {
    loop: true,
    animationData: leafLoading,
    autoplay: true,
  };

  const { View } = useLottie(options);

  return <>{View}</>;
};
