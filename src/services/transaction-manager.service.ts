import { TransactionModel } from '../domain/transaction.model';
import { MoneyModel } from '../domain/money.model';
import { AccountsRepository } from '../repository/accounts.repository';
import dayjs from 'dayjs';
import { AccountModel } from '../domain/account.model';
import { getConversionRate } from '../utils/money.utils';
import { AccountType } from '../domain/account-type.enum';
import { CheckingAccountModel } from '../domain/checking-account.model';

export class TransactionManagerService {
  public transfer(fromAccountId: string, toAccountId: string, value: MoneyModel): TransactionModel {
    const fromAccount = AccountsRepository.get(fromAccountId);
    const toAccount = AccountsRepository.get(toAccountId);

    // The accounts should exist
    if (!fromAccount || !toAccount) {
      throw new Error('Specified account does not exist');
    }

    // Can't transfer from a savings account
    if (fromAccount.accountType === AccountType.SAVINGS) {
      throw new Error("Can't transfer from a savings account");
    }

    // Every bank account should have a bankcard
    if (!(fromAccount as CheckingAccountModel).associatedCard) {
      throw new Error('No active bankcard is associated with the account');
    }

    // and that bankcard should be valid (active and not expired)
    const card = (fromAccount as CheckingAccountModel).associatedCard!;
    const cardActive = card.active;
    const cardExpired = dayjs(card.expirationDate) < dayjs();
    if (!cardActive || cardExpired) {
      throw new Error('The associated bankcard is not active or has expired');
    }

    // The transaction's amount should be under the daily limit
    const transfersToday = fromAccount.transactions
      .filter(transaction => dayjs(transaction.timestamp).isSame(dayjs(), 'day') && transaction.from === fromAccountId)
      .map(transaction => transaction.amount.amount)
      .reduce((acc, curr) => acc + curr, 0);

    if (transfersToday + value.amount > card.dailyTransactionLimit) {
      throw new Error(
        `Daily transaction limit exceeded, the amount of this transfer should be less than or equal to ${card.dailyTransactionLimit - transfersToday} ${fromAccount.balance.currency} (daily limit: ${card.dailyTransactionLimit} ${fromAccount.balance.currency})`
      );
    }

    // If the currencies are different, convert the amount to the currency of the destination account
    if (value.currency !== toAccount.balance.currency) {
      value.amount = value.amount * getConversionRate(value.currency, toAccount.balance.currency);
      value.currency = toAccount.balance.currency;
    }

    // Check if the account has enough funds (if the currency is different, convert the amount to the currency of the account)
    let moneyToRemove = 0;
    if (fromAccount.balance.currency !== value.currency) {
      moneyToRemove = value.amount * getConversionRate(value.currency, fromAccount.balance.currency);
    } else {
      moneyToRemove = value.amount;
    }

    if (fromAccount.balance.amount < moneyToRemove) {
      throw new Error('Insufficient funds');
    }

    // Creating a transaction in the currency of the destination account
    const transaction = new TransactionModel({
      id: crypto.randomUUID(),
      from: fromAccountId,
      to: toAccountId,
      amount: value,
      timestamp: dayjs().toDate(),
    });

    // Inserting the transaction in both accounts
    fromAccount.balance.amount -= moneyToRemove;
    fromAccount.transactions = [...fromAccount.transactions, transaction];
    toAccount.balance.amount += value.amount;
    toAccount.transactions = [...toAccount.transactions, transaction];

    return transaction;
  }

  public withdraw(accountId: string, amount: MoneyModel): TransactionModel {
    if (!AccountsRepository.exist(accountId)) {
      throw new Error('Specified account does not exist');
    }
    const account: AccountModel = AccountsRepository.get(accountId)!;

    // I'm pretending that you can still withdraw money from a savings account (without a bankcard) because I thought that money can be withdrawn from a bank employee
    if (account.accountType === AccountType.CHECKING) {
      // check if the account has an associated bankcard
      if (!(account as CheckingAccountModel).associatedCard) {
        throw new Error('No active bankcard is associated with the account');
      }

      // checking if the bankcard is active and not expired
      const card = (account as CheckingAccountModel).associatedCard!;
      const cardActive = card.active;
      const cardExpired = dayjs(card.expirationDate) < dayjs();
      if (!cardActive || cardExpired) {
        throw new Error('The associated bankcard is not active or has expired');
      }

      //checking the limits
      const transfersToday = account.transactions
        .filter(transaction => dayjs(transaction.timestamp).isSame(dayjs(), 'day') && transaction.from === accountId)
        .map(transaction => transaction.amount.amount)
        .reduce((acc, curr) => acc + curr, 0);

      if (transfersToday + amount.amount > card.dailyWithdrawalLimit) {
        throw new Error(
          `Daily withdrawal limit exceeded, the amount of this transfer should be less than or equal to ${card.dailyWithdrawalLimit - transfersToday} ${account.balance.currency} (daily limit: ${card.dailyWithdrawalLimit} ${account.balance.currency})`
        );
      }
    }

    // If the currencies are different, convert the amount to the currency of the account
    if (account.balance.currency !== amount.currency) {
      amount.amount = amount.amount * getConversionRate(amount.currency, account.balance.currency);
      amount.currency = account.balance.currency;
    }

    // Check if the account has enough funds
    if (account.balance.amount < amount.amount) {
      throw new Error('Insufficient funds');
    }

    // Withdraw the money and create a transaction in the account's currency
    account.balance.amount -= amount.amount;
    const transaction = new TransactionModel({
      id: crypto.randomUUID(),
      from: accountId,
      to: accountId,
      amount,
      timestamp: dayjs().toDate(),
    });

    // Inserting the transaction in the account
    account.transactions = [...account.transactions, transaction];

    return transaction;
  }

  public checkFunds(accountId: string): MoneyModel {
    if (!AccountsRepository.exist(accountId)) {
      throw new Error('Specified account does not exist');
    }
    return AccountsRepository.get(accountId)!.balance;
  }

  public retrieveTransactions(accountId: string): TransactionModel[] {
    if (!AccountsRepository.exist(accountId)) {
      throw new Error('Specified account does not exist');
    }
    return AccountsRepository.get(accountId)!.transactions;
  }
}

export const TransactionManagerServiceInstance = new TransactionManagerService();
