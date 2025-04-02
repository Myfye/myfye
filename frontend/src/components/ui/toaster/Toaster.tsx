import { useToaster } from "react-hot-toast/headless";
import Toast from "./Toast";

const Toaster = () => {
  const { toasts, handlers } = useToaster();
  return (
    <ul>
      {toasts.map((toast) => (
        <li className="toast-wrapper">
          <Toast
            key={toast.id}
            t={toast}
            updateHeight={(height) => handlers.updateHeight(toast.id, height)}
            offset={handlers.calculateOffset(toast, {
              reverseOrder: false,
            })}
          />
        </li>
      ))}
    </ul>
  );
};

export default Toaster;
