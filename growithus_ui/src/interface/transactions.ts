import { TransactionType } from "@/types/transactionType";

export interface Transactions {
    id: string;
    userId: string;
    amount: string;
    createdDate: string;
    transactionType: TransactionType;
    paymentMode: string;
    transactionReferenceId: string;
    destinationAccount: string;
    status: string;
    createdAt: string;
    updatedAt: string;
};