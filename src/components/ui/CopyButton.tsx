import { useState } from "react";
import { CopyIcon } from "../../assets/icons/copyIcon";

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button
      className="px-2 py-1.5 border border-1 border-orange-200 rounded-lg"
      onClick={handleCopy}
    >
      <div className="flex gap-1 items-center">
        <CopyIcon />
        {copied ? "Copied!" : "Copy Room Id"}
      </div>
    </button>
  );
};

export default CopyButton;
