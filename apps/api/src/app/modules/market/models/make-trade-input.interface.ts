import { MarketTransaction } from "../../../models/market-transaction.entity";

export type MakeTradeInput = Omit<MarketTransaction, "id">;
