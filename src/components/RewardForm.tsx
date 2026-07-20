"use client";

import { useState, useTransition } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full border-2 border-dashed border-gray-300 px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-faint hover:border-ink hover:text-ink hover:bg-paper/40"
      >
        + Add reward
      </button>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
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
    });
  }

  return (
    <form className="panel-flat p-5 space-y-3" onSubmit={handleSubmit}>
      <p className="label-micro">New reward</p>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError(null);
        }}
        placeholder="Reward name"
        required
        disabled={pending}
        className="field"
        aria-invalid={!!error}
        aria-describedby={error ? "reward-name-error" : undefined}
      />
      {error ? (
        <p id="reward-name-error" className="text-xs text-ink font-medium" role="alert">
          {error}
        </p>
      ) : null}
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        disabled={pending}
        className="field"
      />
      <div className="flex items-center gap-2">
        <label
          htmlFor={`cost-${buckType}`}
          className="label-micro shrink-0"
        >
          Cost
        </label>
        <input
          id={`cost-${buckType}`}
          type="number"
          value={cost}
          onChange={(e) =>
            setCost(Math.max(1, parseInt(e.target.value, 10) || 1))
          }
          min={1}
          required
          disabled={pending}
          className="field w-24"
        />
        <span className="text-xs text-muted">bucks</span>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          disabled={pending}
          className="btn btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
