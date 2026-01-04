// app/wingo/types.ts

export type ColorType = "red" | "green" | "violet";

export interface GameHistoryItem {
  period: string;
  number: number;
  bigSmall: "Big" | "Small";
  color: ColorType;
}

export interface MyHistoryItem {
  id: string;
  result: number;
  time: string;
  status: "Succeed" | "Failed";
  amount: number;
  orderNumber: string;
  period: string;
  purchaseAmount: number;
  quantity: number;
  amountAfterTax: number;
  tax: number;
  select: string;
  bigSmall: "Big" | "Small";
  winLose: number;
}
