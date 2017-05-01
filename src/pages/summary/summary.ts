import {Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import {LoanCalcService} from "../../services/loan-calc.service";

@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html'
})
export class SummaryPage {

  startingYear: number = 2017;

  estimatedSalary = 25000;

  accordion : boolean[] = [false, false];


  public repaymentChartType = 'bar';
  public repaymentChartOptions: any = {
    responsive: true,
    animation: {
      duration: 0
    },
    legend: {
      position:'bottom',
      labels: {
        fontSize: 10,
        usePointStyle: true
      }
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Year'
        }
      }],
      yAxes: [
        {
          id: 'yAxis1',
          position: 'left',
          label: 'Loan amount',
          ticks: {
            callback: function(value, index, values) {
              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
          }
        },
        {
          id: 'yAxis2',
          position: 'right',
          label: 'Repayment and Interest',
          ticks: {
            callback: function(value, index, values) {
              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
          }
        }
      ]
    }
  };

  public repaymentChartColors:Array<any> = [
    { // orange
      borderColor: '#F16227',
      backgroundColor: 'transparent'
    },
    { // green
      borderColor: '#6FCF97',
      backgroundColor: 'transparent'
    }
  ];

  chartDataReady = false;

  constructor(public navCtrl: NavController,
              public loanData: LoanCalcService) {

  }

  ionViewWillEnter() {
    this.loanData.recalcData();
    this.chartDataReady = true;
  }

  accordionOpen(index) {
    return this.accordion[index];
  }

}
