export type AccountType = "CHECKING" | "SAVINGS";

export type MoneyModel = {
  amount: number;
  currency: 'RON' | 'EUR';
};

export type TransactionModel = {
  id: string;
  from: string;
  to: string;
  amount: MoneyModel;
  timestamp: Date;
};

export type CardModel = {
  cardNumber: number;
  cardHolderName: string;
  cvv: number;
  expirationDate: Date;
  issueDate: Date;
  contactless: boolean;
  active: boolean;
  dailyWithdrawalLimit: number;
  dailyTransactionLimit: number;
};
// Account interface -> SavingAccount and CheckingAccount types

export interface Account {
  id: string;
  accountType: AccountType;
  balance: MoneyModel;
  transactions: TransactionModel[];
}

export interface CheckingAccount extends Account {
  associatedCard?: CardModel;
}

export interface SavingsAccount extends Account {
  interest: number;
  interestFrequency: 'MONTHLY' | 'QUARTERLY';
  lastInterestAppliedDate: Date;
}
