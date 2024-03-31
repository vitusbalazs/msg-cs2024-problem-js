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

    if (!fromAccount || !toAccount) {
      throw new Error('Specified account does not exist');
    }

    if (fromAccount.accountType === AccountType.SAVINGS) {
      throw new Error("Can't transfer from a savings account");
    }

    if (!(fromAccount as CheckingAccountModel).associatedCard) {
      throw new Error('No active bankcard is associated with the account');
    }

    const cardActive = (fromAccount as CheckingAccountModel).associatedCard!.active;
    const cardExpired = dayjs((fromAccount as CheckingAccountModel).associatedCard!.expirationDate) < dayjs();
    if (!cardActive || cardExpired) {
      throw new Error('The associated bankcard is not active or has expired');
    }

    //check the limits

    if (value.currency !== toAccount.balance.currency) {
      value.amount = value.amount * getConversionRate(value.currency, toAccount.balance.currency);
      value.currency = toAccount.balance.currency;
    }

    let moneyToRemove = 0;
    if (fromAccount.balance.currency !== value.currency) {
      moneyToRemove = value.amount * getConversionRate(value.currency, fromAccount.balance.currency);
    } else {
      moneyToRemove = value.amount;
    }

    if (fromAccount.balance.amount < moneyToRemove) {
      throw new Error('Insufficient funds');
    }

    const transaction = new TransactionModel({
      id: crypto.randomUUID(),
      from: fromAccountId,
      to: toAccountId,
      amount: value,
      timestamp: dayjs().toDate(),
    });

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

    if (account.accountType === AccountType.CHECKING) {
      if (!(account as CheckingAccountModel).associatedCard) {
        throw new Error('No active bankcard is associated with the account');
      }

      const cardActive = (account as CheckingAccountModel).associatedCard!.active;
      const cardExpired = dayjs((account as CheckingAccountModel).associatedCard!.expirationDate) < dayjs();
      if (!cardActive || cardExpired) {
        throw new Error('The associated bankcard is not active or has expired');
      }

      //check the limits
    }

    if (account.balance.currency !== amount.currency) {
      amount.amount = amount.amount * getConversionRate(amount.currency, account.balance.currency);
      amount.currency = account.balance.currency;
    }

    if (account.balance.amount < amount.amount) {
      throw new Error('Insufficient funds');
    }

    account.balance.amount -= amount.amount;
    const transaction = new TransactionModel({
      id: crypto.randomUUID(),
      from: accountId,
      to: accountId,
      amount,
      timestamp: dayjs().toDate(),
    });
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
