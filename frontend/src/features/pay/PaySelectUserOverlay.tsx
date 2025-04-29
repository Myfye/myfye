import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleOverlay, updateUser } from "./paySlice";
import { User } from "../users/types";
import SelectUserOverlay from "../users/SelectUserOverlay";

const PaySelectUserOverlay = ({ zIndex = 2000 }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.pay.overlays.selectUser.isOpen
  );

  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleOverlay({ type: "selectUser", isOpen: isOpen }));
  };

  const onUserSelect = (user: User) => {
    console.log(user);
    dispatch(updateUser(user));
    dispatch(toggleOverlay({ type: "confirmTransaction", isOpen: true }));
  };

  return (
    <>
      <SelectUserOverlay
        isOpen={isOpen}
        onOpenChange={handleOpen}
        onUserSelect={onUserSelect}
        onScanSuccess={() => {}}
        onScanFail={() => {}}
      />
    </>
  );
};

export default PaySelectUserOverlay;
