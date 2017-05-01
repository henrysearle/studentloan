import {Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import {LoanCalcService} from "../../services/loan-calc.service";
import {SummaryPage} from "../summary/summary";
import {FormGroup} from "@angular/forms";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;

  loanInputForm: FormGroup;

  career: string = 'lawyer';

  constructor(public navCtrl: NavController,
              public loanData: LoanCalcService) {

  }


  ionViewDidEnter() {
    // lock swipes so the user can't just switch from one to another
    this.slides.lockSwipes(true);
  }

  slideNext() {
    // unlock swipes to go to the next page
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  slidePrev() {
    // unlock swipes to go to the next page
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  goToLawyerExample() {
    this.loanData.loadExample('lawyer');
    this.goToSummary();
  }

  goToSummary() {
    this.loanData.loadSalary(this.career);
    this.loanData.loadLoanData();
    this.navCtrl.push(SummaryPage);
  }

}
