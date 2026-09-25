export type PumpPayload = {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  multiplier: number;
  popped?: boolean;
};