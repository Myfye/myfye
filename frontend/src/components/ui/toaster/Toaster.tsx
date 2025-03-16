import toast, { useToaster } from "react-hot-toast/headless";

const Toast = ({ t, updateHeight, offset }) => {};

const Toaster = () => {
  const { toasts, handlers } = useToaster();
  return (
    <div>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          t={t}
          updateHeight={(height) => handlers.updateHeight(t.id, height)}
          offset={handlers.calculateOffset(t, {
            reverseOrder: false,
          })}
        />
      ))}
    </div>
  );
};

export default Toaster;
