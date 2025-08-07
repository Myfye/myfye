import { useEffect, useRef, useState } from "react";

export const useCopyAndPaste = (text: string) => {
  const [isCopied, setCopied] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const onCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    timeout.current = setTimeout(() => {
      timeout.current = null;
      setCopied(false);
    }, 3000);
  };

  useEffect(() => {
    console.log(isCopied, "copied");
  }, [isCopied]);
  return {
    isCopied,
    onCopy,
  };
};
