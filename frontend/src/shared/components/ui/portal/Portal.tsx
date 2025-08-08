import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  containerId: string;
  children?: ReactNode;
}

const createWrapperAndAppendToBody = (containerId: string) => {
  const containerEl = document.createElement("div");
  containerEl.setAttribute("id", containerId);
  document.body.appendChild(containerEl);
  return containerEl;
};

const Portal = ({ children, containerId }: PortalProps) => {
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let el = document.getElementById(containerId);
    let systemCreated = false;
    // if element is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!el) {
      systemCreated = true;
      el = createWrapperAndAppendToBody(containerId);
    }
    setContainerEl(el);

    return () => {
      // delete the programatically created element
      if (systemCreated && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [containerId]);

  // wrapperElement state will be null on the very first render.
  if (containerEl === null) return null;

  return createPortal(
    children,
    document.getElementById(containerId) as HTMLDivElement
  );
};
export default Portal;
