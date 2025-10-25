import { css } from "@emotion/react";
import ActivityList from "./activityList";
import { toggleOverlay } from "@/features/activity/stores/activitySlice";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import { useGetTransactionHistoryQuery } from "@/features/activity/api/activityApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import RingLoader from "@/shared/components/ui/loading/spinners/RingLoader";
import Button from "@/shared/components/ui/button/Button";

const ActivityOverlay = () => {
  const isOpen = useAppSelector(
    (state) => state.activity.overlays.activity.isOpen
  );
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.userWalletData.currentUserID);
  const solPubKey = useAppSelector(
    (state) => state.userWalletData.solanaPubKey
  );
  const evmPubKey = useAppSelector((state) => state.userWalletData.evmPubKey);

  const { isError, isLoading, isSuccess, data, error, refetch, status } =
    useGetTransactionHistoryQuery({
      solPubKey,
      evmPubKey,
      userId,
    });

  if (error) {
    console.error("Error loading activity overlay: ", error);
  }

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        dispatch(toggleOverlay({ isOpen, type: "activity" }));
      }}
      title="Activity"
    >
      {isLoading && (
        <div
          css={css`
            display: grid;
            place-items: center;
            height: 100cqh;
          `}
        >
          <RingLoader />
        </div>
      )}
      {isError && (
        <div
          css={css`
            display: grid;
            place-items: center;
            height: 100cqh;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            <span>Error loading Activity Page. Please try again.</span>
            <Button onPress={() => refetch()}>Try again</Button>
          </div>
        </div>
      )}
      {isSuccess && data && (
        <ActivityList transactions={data.cleanedTransaction} />
      )}
    </Overlay>
  );
};

export default ActivityOverlay;
