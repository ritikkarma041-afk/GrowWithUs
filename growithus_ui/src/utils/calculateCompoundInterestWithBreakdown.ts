// src/utils/calculateCompoundInterestWithBreakdown.ts

export interface Deposit {
    amount: number;
    date: string | Date;
}

export interface DepositBreakdown {
    amount: number;
    date: string | Date;
    days: number;
    interest: number;
    finalAmount: number;
}

export interface CompoundInterestResult {
    totalInterest: number;
    breakdown: DepositBreakdown[];
}

export function calculateCompoundInterestWithBreakdown(
    deposits: Deposit[],
    annualRate: number,
    calculationDate: string | Date = new Date(),
    daysInYear = 365
): CompoundInterestResult {
    const dailyRate = annualRate / 100 / daysInYear;
    const calcDate = new Date(calculationDate);

    let totalInterest = 0;

    const breakdown: DepositBreakdown[] = deposits.map(({ amount, date }) => {
        const depositDate = new Date(date);

        if (depositDate > calcDate) {
            return { amount, date, days: 0, interest: 0, finalAmount: amount };
        }

        const days = Math.floor(
            (calcDate.getTime() - depositDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const finalAmount = amount * Math.pow(1 + dailyRate, days);
        const interest = finalAmount - amount;

        totalInterest += interest;

        return {
            amount,
            date,
            days,
            interest: Number(interest.toFixed(2)),
            finalAmount: Number(finalAmount.toFixed(2)),
        };
    });

    return {
        totalInterest: Number(totalInterest.toFixed(2)),
        breakdown,
    };
}
