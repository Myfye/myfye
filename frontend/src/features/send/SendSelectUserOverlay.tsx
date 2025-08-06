import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SelectUserOverlay from "../users/SelectUserOverlay";
import { toggleOverlay, updateUser } from "./sendSlice";
import { User } from "../users/users.types";
import toast from "react-hot-toast/headless";
import { useEffect } from "react";

const SendSelectUserOverlay = ({ zIndex = 2000 }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.send.overlays.selectUser.isOpen
  );

  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleOverlay({ type: "selectUser", isOpen: isOpen }));
  };

  const onUserSelect = (user: User) => {
    dispatch(updateUser(user));
    dispatch(toggleOverlay({ type: "confirmTransaction", isOpen: true }));
  };

  return (
    <>
      <SelectUserOverlay
        zIndex={zIndex}
        isOpen={isOpen}
        onOpenChange={handleOpen}
        onUserSelect={onUserSelect}
        onScanSuccess={() => {}}
        onScanFail={() => {
          toast.error("Error scanning user. Please try again");
        }}
      />
    </>
  );
};

export default SendSelectUserOverlay;
