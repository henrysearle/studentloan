import {Injectable} from '@angular/core';

export interface LoanData {
  years: number;
  startingYear: number;

  loanBreakdown: LoanBreakdown[];

  tuitionFees: YearMoney[];
  totalTuition: number;

  maintenanceLoan: YearMoney[];
  totalMaintenance: number;

  maintenanceOptions: MaintenanceOptions;
}

export interface LoanBreakdown {
  year: number;
  maintenance: number;
  tuition: number;
}

export interface MaintenanceOptions {
  livesWithParents: boolean;
  studiesInLondon: boolean;
}

export interface YearMoney {
  year: number;
  money: number;
}

export interface InterestPayments {
  lowerThreshold: number;
  higherThreshold: number;

  lowerInterest: number;
  higherInterest: number;

  repaymentPc: number;
  maxPaymentYear: number;
}

@Injectable()
export class LoanCalcService {

  lawyerExample : LoanData = {
    years: 3,
    startingYear: 2017,

    loanBreakdown: [
      {year: 2017, tuition: 9250, maintenance: 11002},
      {year: 2018, tuition: 9250, maintenance: 11310},
      {year: 2019, tuition: 9250, maintenance: 11627}
    ],

    tuitionFees: [
      {year: 2017, money: 9250},
      {year: 2018, money: 9250},
      {year: 2019, money: 9250}
    ],
    totalTuition: 27750,

    maintenanceLoan: [
      {year: 2017, money: 11002},
      {year: 2018, money: 11310},
      {year: 2019, money: 11627}
    ],
    totalMaintenance: 33939,

    maintenanceOptions: {
      livesWithParents: false,
      studiesInLondon: true
    }
  };


  loan: LoanData = {
    years: 0,
    startingYear: 0,

    loanBreakdown: [],

    tuitionFees: [],
    totalTuition: 0,

    maintenanceLoan: [],
    totalMaintenance: 0,

    maintenanceOptions: {
      livesWithParents: undefined,
      studiesInLondon: undefined
    }
  };

  interestPayments: InterestPayments = {
    lowerThreshold: 21000,
    higherThreshold: 41000,

    lowerInterest: 0.00,
    higherInterest: 0.03,

    repaymentPc: 0.09,
    maxPaymentYear: 30
  };

  tuitionFees = {
    2017: 9250,
    2016: 9000,
    2015: 9000
  };

  rpi = {
    2017: 0.023,
    2018: 0.03,
    2019: 0.032,
    2020: 0.034
  };

  salaryInfo: YearMoney[] = [];

  lawyerSalaryExample : YearMoney[] = [
    {year: 0, money: 38000 },
    {year: 1, money: 40000 },
    {year: 2, money: 63000 },
    {year: 3, money: 70000 },
    {year: 4, money: 75000 },
    {year: 5, money: 82000 },
    {year: 6, money: 88000 },
    {year: 7, money: 93000 },
    {year: 8, money: 98000 },
    {year: 9, money: 101000 },
    {year: 10, money: 103000 },
    {year: 11, money: 103000 },
    {year: 12, money: 103000 },
    {year: 13, money: 180000 },
    {year: 14, money: 180000 },
    {year: 15, money: 180000 },
    {year: 16, money: 180000 },
    {year: 17, money: 180000 },
    {year: 18, money: 180000 },
    {year: 19, money: 180000 },
    {year: 20, money: 180000 },
    {year: 21, money: 260000 },
    {year: 22, money: 260000 },
    {year: 23, money: 260000 },
    {year: 24, money: 260000 },
    {year: 25, money: 260000 },
    {year: 26, money: 260000 },
    {year: 27, money: 260000 },
    {year: 28, money: 260000 },
    {year: 29, money: 260000 },
    {year: 30, money: 260000 },
  ];


  labels: number[] = [];
  balanceData: number[] = [];
  interestData: number[] = [];
  repaymentData: number[] = [];

  constructor() {
  }

  loadExample(example) {
    switch (example) {
      case 'lawyer':
      default:
        this.loan = this.lawyerExample;
        this.salaryInfo = this.lawyerSalaryExample;
    }
  }

  loadSalary(career) {
    switch (career) {
      case 'lawyer':
      default:
        this.salaryInfo = this.lawyerSalaryExample;
    }
  }

  loadLoanData() {
    let i = 0,
        // tuition fees stay flat based on the starting year
        tuitionFees = this.tuitionFees[this.loan.startingYear];

    this.loan.loanBreakdown = [];
    this.loan.tuitionFees = [];
    this.loan.maintenanceLoan = [];

    this.loan.totalTuition = 0;
    this.loan.totalMaintenance = 0;

    while (i < this.loan.years) {
      let year = this.loan.startingYear + i,
          maintenance = this.getMaintenanceLoan(year);

      this.loan.loanBreakdown.push({
        year: year,
        tuition: tuitionFees,
        maintenance: maintenance
      });
      this.loan.tuitionFees.push({
        year: year,
        money: tuitionFees
      });
      this.loan.maintenanceLoan.push({
        year: year,
        money: maintenance
      });

      this.loan.totalTuition += tuitionFees;
      this.loan.totalMaintenance += maintenance;
      i++;
    }

    console.log(this.loan)
  }

  getRpi(year: number) {
    if (this.rpi && this.rpi[year] !== undefined) {
      return this.rpi[year];
    }
    return 0.034;
  }

  isInStudy(year): boolean {
    return year <= this.loan.startingYear + this.loan.years;
  }

  getVariableInterestAfterStudy(salary: number) {
    if (salary < this.interestPayments.lowerThreshold) {
      return this.interestPayments.lowerInterest;
    } else if (salary > this.interestPayments.higherThreshold) {
      return this.interestPayments.higherInterest;
    } else {
      return this.interestPayments.higherInterest * ((salary - this.interestPayments.lowerThreshold) / (this.interestPayments.higherThreshold - this.interestPayments.lowerThreshold))
    }

  }

  getInterestLevel(year: number) {
    if (this.isInStudy(year)) {
      return this.getRpi(year) + 0.03;
    } else {
      // need to add salary here also
      return this.getRpi(year) + this.getVariableInterestAfterStudy(this.getSalary(year));
    }
  }

  calcInterestOverYears(balance: number, startingYear: number, numberYears: number): number {
    let interestAmount = 0,
        year = startingYear,
        finishingYear = startingYear + numberYears;
    while (year < finishingYear) {
      interestAmount += balance * this.getInterestLevel(year);
      balance = balance + interestAmount;
      year++;
    }
    return interestAmount;
  }

  eligibleRepaymentAmount(salary) {
    if (salary < this.interestPayments.lowerThreshold) {
      return 0;
    }
    return salary - this.interestPayments.lowerThreshold;
  }

  getRepaymentAmount(salary) {
    return this.eligibleRepaymentAmount(salary) * this.interestPayments.repaymentPc;
  }

  getTotalLoan() {
    let total = 0;
    for (let l of this.loan.loanBreakdown) {
      total += l.tuition + l.maintenance
    }
    return total;
  }

  getTotalInterest() {
    let total = 0;
    for (let l of this.loan.loanBreakdown) {
      total += this.calcInterestOverYears(
        l.maintenance + l.tuition,
        l.year,
        this.loan.years - (l.year - this.loan.startingYear)
      )
    }
    return total;
  }

  getSalary(year: number): number {
    if (year < this.loan.startingYear + this.loan.years) {
      return 0;
    }

    let salary = 0,
        yearsInWork = year - (this.loan.startingYear + this.loan.years) ;

    this.salaryInfo.forEach(a => {
      if (a.year == yearsInWork) {
        salary = a.money;
      }
    });
    return salary;
  }

  recalcData() {
    this.labels = [];
    this.balanceData = [];
    this.interestData = [];
    this.repaymentData = [];

    let year = this.loan.startingYear + this.loan.years,
      endingYear = this.loan.startingYear + this.loan.years + this.interestPayments.maxPaymentYear,
      balance = this.getTotalLoan() + this.getTotalInterest();

    while (year <= endingYear) {
      if (balance <= 1) {
        break;
      }

      this.labels.push(year);

      let salary = this.getSalary(year),
        interest = balance * this.getInterestLevel(year),
        repayment = this.getRepaymentAmount(salary);

      if (repayment > balance + interest) {
        repayment = balance + interest;
      }

      this.balanceData.push(balance);
      this.interestData.push(interest);
      this.repaymentData.push(repayment);

      balance += interest - repayment;

      year++;
    }
  }

  chartLabels() {
    return this.labels;
  }

  chartData() {

    let chartData = [
      {
        label: 'Repayments',
        data: this.repaymentData,
        type: 'bar',
        yAxisID: 'yAxis2'
      },
      {
        label: 'Interest',
        data: this.interestData,
        type: 'bar',
        yAxisID: 'yAxis2'
      },
      {
        label: 'Total Loan',
        data: this.balanceData,
        type: 'line',
        yAxisID: 'yAxis1'
      },
    ];

    return chartData;
  }

  getGraduationYear() {
    return this.loan.startingYear + this.loan.years;
  }

  lastPaybackDate() {
    if (this.labels && this.labels.length == 0) {
      return 2017;
    }
    return this.labels[this.labels.length - 1];
  }

  pre2016() {
    if (this.loan.maintenanceOptions.livesWithParents) {
      return {
        2018: 4941,
        2017: 4806,
        2016: 4675,
        2015: 4565
      }
    } else {
      if (this.loan.maintenanceOptions.studiesInLondon) {
        return {
          2018: 8668,
          2017: 8432,
          2016: 8202,
          2015: 8009
        }
      } else {
        return {
          2018: 6213,
          2017: 6043,
          2016: 5878,
          2015: 5740
        }
      }
    }
  }

  post2016() {
    if (this.loan.maintenanceOptions.livesWithParents) {
      return {
        2020: 7709,
        2019: 7499,
        2018: 7295,
        2017: 7097,
        2016: 6904
      }
    } else {
      if (this.loan.maintenanceOptions.studiesInLondon) {
        return {
          2020: 11953,
          2019: 11627,
          2018: 11310,
          2017: 11002,
          2016: 10702
        }
      } else {
        return {
          2020: 9159,
          2019: 8910,
          2018: 8666,
          2017: 8430,
          2016: 8200
        }
      }
    }
  }

  getMaintenanceLoan(year) {
    let data;
    if (this.loan.startingYear < 2016) {
      data = this.pre2016();
    } else {
      data = this.post2016();
    }
    if (data[year]) {
      return data[year];
    }

    // just get the first one
    for (let index of data) {
      return data[index];
    }
  }


}
