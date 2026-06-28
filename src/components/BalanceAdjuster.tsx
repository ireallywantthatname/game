"use client";

import { useState } from "react";
import { adjustBuck } from "@/app/actions";

export function BalanceAdjuster() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <PersonAdjuster
        title="Achini"
        buckType="akash"
        description="When she does something he enjoys (+1) — or the reverse (-1)"
      />
      <PersonAdjuster
        title="Akash"
        buckType="achini"
        description="When he does something she enjoys (+1) — or the reverse (-1)"
      />
    </div>
  );
}

function PersonAdjuster({
  title,
  buckType,
  description,
}: {
  title: string;
  buckType: "akash" | "achini";
  description: string;
}) {
  const [reason, setReason] = useState("");

  const handleAdjust = (amount: number) => {
    adjustBuck(buckType, amount, reason || "No reason given");
    setReason("");
  };

  return (
    <div className="border-2 border-black p-4">
      <p className="font-bold uppercase tracking-widest text-sm">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason..."
        className="w-full mt-3 border-2 border-black px-3 py-2 text-sm font-mono bg-white
                   focus:outline-none focus:bg-gray-100"
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => handleAdjust(1)}
          className="flex-1 border-2 border-black px-4 py-2 text-sm font-bold uppercase
                     hover:bg-black hover:text-white transition-colors"
        >
          +1 Buck
        </button>
        <button
          onClick={() => handleAdjust(-1)}
          className="flex-1 border-2 border-black px-4 py-2 text-sm font-bold uppercase
                     hover:bg-black hover:text-white transition-colors"
        >
          -1 Buck
        </button>
      </div>
    </div>
  );
}
