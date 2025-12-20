// Reel.tsx
import React, { useEffect, useState } from "react";
import Symbol from "./symbol";
import { SYMBOLS } from "./spriteConfig";

type Props = {
  spinning: boolean;
  stopIndex: number;
};

const Reel: React.FC<Props> = ({ spinning, stopIndex }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!spinning) return;

    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 25); // 25 sprite frames
    }, 50);

    return () => clearInterval(interval);
  }, [spinning]);

  return (
    <div className="reel">
      {[0, 1, 2].map((row) => (
        <Symbol
          key={row}
          symbol={SYMBOLS[stopIndex]}
          frame={spinning ? frame : stopIndex}
        />
      ))}
    </div>
  );
};

export default Reel;
