"use client";

import { useState } from "react";
import { createReward } from "@/app/actions";

export function RewardForm({
  buckType,
}: {
  buckType: "akash" | "achini";
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(5);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs uppercase tracking-widest border-2 border-dashed border-gray-300
                   px-4 py-2 hover:border-black transition-colors w-full text-gray-400
                   hover:text-black"
      >
        + Add Reward
      </button>
    );
  }

  async function handleSubmit() {
    if (!name.trim()) return;
    await createReward({
      name: name.trim(),
      description: description.trim(),
      cost,
      buck_type: buckType,
    });
    setName("");
    setDescription("");
    setCost(5);
    setOpen(false);
  }

  return (
    <form
      className="border-2 border-black p-4 space-y-3"
      action={handleSubmit}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Reward name"
        required
        className="w-full border-2 border-black px-3 py-2 text-sm font-mono
                   focus:outline-none focus:bg-gray-100"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full border-2 border-black px-3 py-2 text-sm font-mono
                   focus:outline-none focus:bg-gray-100"
      />
      <div className="flex items-center gap-2">
        <label className="text-xs uppercase tracking-widest text-gray-500">
          Cost
        </label>
        <input
          type="number"
          value={cost}
          onChange={(e) =>
            setCost(Math.max(1, parseInt(e.target.value) || 1))
          }
          min={1}
          required
          className="w-24 border-2 border-black px-3 py-2 text-sm font-mono
                     focus:outline-none focus:bg-gray-100"
        />
        <span className="text-xs text-gray-500">bucks</span>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="border-2 border-black px-4 py-2 text-xs uppercase font-bold
                     hover:bg-black hover:text-white transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="border-2 border-gray-500 px-4 py-2 text-xs uppercase text-gray-500
                     font-bold hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
