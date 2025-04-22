import Overlay from "@/components/ui/overlay/Overlay";

const AssetOverlay = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (e: boolean) => void;
}) => {
  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange}></Overlay>
    </>
  );
};

export default AssetOverlay;
