export interface GameState {
  akash_bucks: number;
  achini_bucks: number;
  updated_at: string;
}

export interface Transaction {
  id: string;
  buck_type: "akash" | "achini";
  amount: number;
  reason: string;
  created_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  buck_type: "akash" | "achini";
  status: "available" | "redeemed";
  created_at: string;
  updated_at: string;
  redeemed_at: string | null;
}
