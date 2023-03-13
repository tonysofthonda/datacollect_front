import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { FinancialState } from "@models/financial-state.model";
import { MessageService } from "primeng/api";
import { FinancialActive } from "../../models/active.model";
import { AnalisysFinancial } from "../../models/analisys.model";
import { NameAccountFinancial } from "../../models/nameaccount.model";
import { Page2And3IncomeDeductionFinancial } from "../../models/page2and3-incomededuction.moddel";
import { Page2And3OtherIncomeFinancial } from "../../models/page2and3-otherincome.model";
import { Page2And3PositionFinancial } from "../../models/page2and3-position.model";
import { Page2And3Financial } from "../../models/page2and3.model";
import { Page4Financial } from "../../models/page4.model";
import { FinancialPassive } from "../../models/passive.model";
import { PerMonthFinancial } from "../../models/permonth.model";
import { FinancialActiveService } from "./financial-detail.service";


@Component({
    selector: 'app-financial-detail',
    templateUrl: './financial-detail.component.html',
    styles: [`
        :host ::ng-deep .p-cell-editing {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
    `]
})
export class FinancialDetailComponent implements OnInit {
  active: FinancialActive[] = [];
  passive: FinancialPassive[] = [];
  analisys: AnalisysFinancial[] = [];
  perMonth: PerMonthFinancial[] = [];
  nameAccount: NameAccountFinancial[] = [];
  page2And3Financial: Page2And3Financial[] = [];
  page2And3PositionFinancial: Page2And3PositionFinancial[] = [];
  page2And3OtherIncomeFinancial: Page2And3OtherIncomeFinancial[] = [];
  page2And3IncomeDeductionFinancial: Page2And3IncomeDeductionFinancial[] = [];
  page4Financial: Page4Financial[] = [];
  financialId: number;
  activeState: boolean[] = [true, false, false];
  loadingPage1: boolean = false;
  loadingPage2and3: boolean = false;
  loadingPage4: boolean = false;
  onTabOpen1Flag: boolean = true;
  onTabOpen2and3Flag: boolean = true;
  onTabOpen4Flag: boolean = true;

  financialStateForm = this.formBuilder.group({
    id: [null],
    dealerNumber: [{value: '', disabled: true}],
    city:[{value: '', disabled: true}],
    state:[{value: '', disabled: true}],
    zip: [{value: '', disabled: true}],
    periodFrom: [{value: '', disabled: true}],
    periodTo: [{value: '', disabled: true}]
  });

  constructor(private financialActiveService: FinancialActiveService,
              private messageService: MessageService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.route.params.subscribe(data => {
      this.financialId = data['id'];
    });   
    this.financialActiveService.getInformation(this.financialId).subscribe((data) => {
      this.financialStateForm.get('dealerNumber')?.setValue(data.dealerNumber);
      this.financialStateForm.get('city')?.setValue(data.city);
      this.financialStateForm.get('state')?.setValue(data.state);
      this.financialStateForm.get('zip')?.setValue(data.zip);
      this.financialStateForm.get('periodFrom')?.setValue(data.periodFrom);
      this.financialStateForm.get('periodTo')?.setValue(data.periodTo);
    });
  }

  onTabClose(event: any) {
    
  }

  onTabOpen1(event: any) {
    if(this.onTabOpen1Flag === true) {
      console.log(event);
      this.financialActiveService.get(this.financialId).subscribe(data => { this.loadingPage1 = false; this.active = data; });
      this.financialActiveService.getPassive(this.financialId).subscribe(data => { this.passive = data; });
      this.financialActiveService.getFinancialNameAccount(this.financialId).subscribe(data => { this.nameAccount = data; });
      this.financialActiveService.getPerMonthFinancial(this.financialId).subscribe(data => { this.perMonth = data; });
      this.financialActiveService.getFinancialAnalisys(this.financialId).subscribe(data => { this.loadingPage1 = true; this.analisys = data; });
      this.onTabOpen1Flag = false;
    }
  }

  onTabOpen2and3(event: any) {
    if(this.onTabOpen2and3Flag === true) {
      this.financialActiveService.getIncomeAndExpesesPage3( this.financialId).subscribe(data => { this.loadingPage2and3 = false; this.page2And3Financial = data; });
      this.financialActiveService.getPositionPage3(this.financialId).subscribe(data => { this.page2And3PositionFinancial = data; });
      this.financialActiveService.getOtherIncomePage3(this.financialId).subscribe(data => { this.page2And3OtherIncomeFinancial = data; });
      this.financialActiveService.getIncomeDeductionPage3(this.financialId).subscribe(data => { this.loadingPage2and3 = true; this.page2And3IncomeDeductionFinancial = data; });
      this.onTabOpen2and3Flag = false;
    }
  }

  onTabOpen4(event: any) {
    if(this.onTabOpen4Flag === true) {
      this.loadingPage4 = true;
      this.financialActiveService.getIncomeAndExpensesPage4(this.financialId).subscribe(data => {
        this.page4Financial = data;
        this.loadingPage4 = false;
      });
      this.onTabOpen4Flag = false;
    }
  }

  toggle(index: number) {
      this.activeState[index] = !this.activeState[index];
  }

  onRowEditSave(financialActive: FinancialActive) {    
      if (financialActive.importe > 0) {
          this.financialActiveService.putActiveFinancial(financialActive).subscribe(data => {
            this.messageService.add({severity:'success', summary: 'Success', detail:'It updated correctly'});
          });
      }
      else {
          this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Data'});
      }
  }

  onRowEditSavePassive(financialPassive: FinancialPassive) {
    if (financialPassive.importe > 0) {
      this.financialActiveService.putPassive(financialPassive).subscribe(data => {
        this.messageService.add({severity:'success', summary: 'Success', detail:'It updated correctly'});
      });
    } else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Data'});
    }
  }

  onRowEditSaveOtherActive(nameAccount: NameAccountFinancial) {
    if (nameAccount !== null) {
      this.financialActiveService.putFinancialNameAccount(nameAccount).subscribe(data => {
        this.messageService.add({severity:'success', summary: 'Success', detail:'It updated correctly'});
      });
    } else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Data'});
    }
  }

  onRowEditSaveOtherPassive(perMonth: PerMonthFinancial) {
    if (perMonth !== null) {
      this.financialActiveService.putPerMonthFinancial(perMonth).subscribe(data => {
        this.messageService.add({severity:'success', summary: 'Success', detail:'It updated correctly'});
      });
    } else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Data'});
    }
  }

  onRowEditSaveAnalisys(analisys: AnalisysFinancial) {
    if (analisys !== null) {
      this.financialActiveService.putFinancialAnalisys(analisys).subscribe(data => {
        this.messageService.add({severity:'success', summary: 'Success', detail:'It updated correctly'});
      });
    } else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Data'});
    }
  }

  onRowEditSavePage4(page4Financial: Page4Financial) {    
    if (page4Financial !== null) {
        this.financialActiveService.putIncomeAndExpensesPage4(page4Financial).subscribe(data => {
          this.messageService.add({severity:'success', summary: 'Success', detail:'It updated correctly'});
        });
        
    }
    else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Data'});
    }
  }

  onRowEditSavedeductionFinancialPage3(deductionFinancial: Page2And3IncomeDeductionFinancial) {
    if (deductionFinancial !== null) {
      this.financialActiveService.putIncomeDeductionPage3(deductionFinancial).subscribe(data => {
        this.messageService.add({severity:'success', summary: 'Success', detail:'It updated correctly'});
      });
      
    }
    else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Data'});
    }
  }

  onRowEditSaveincomeFinancialPage3(page2And3OtherIncomeFinancial: Page2And3OtherIncomeFinancial) {
    if (page2And3OtherIncomeFinancial !== null) {
      this.financialActiveService.putOtherIncomePage3(page2And3OtherIncomeFinancial).subscribe(data => {
        this.messageService.add({severity:'success', summary: 'Success', detail:'It updated correctly'});
      });
      
    }
    else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Data'});
    }
  }

  onRowEditSavePositionPage3(page2And3PositionFinancial: Page2And3PositionFinancial) {
    console.log(JSON.stringify(page2And3PositionFinancial));
    
    if (page2And3PositionFinancial !== null) {
      this.financialActiveService.putPositionPage3(page2And3PositionFinancial).subscribe(data => {
        this.messageService.add({severity:'success', summary: 'Success', detail:'It updated correctly'});
      });
      
    }
    else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Data'});
    }
  }

  onRowEditSavePage3(page2And3Financial: Page2And3Financial) {
    if (page2And3Financial !== null) {
      this.financialActiveService.putIncomeAndExpesesPage3(page2And3Financial).subscribe(data => {
        this.messageService.add({severity:'success', summary: 'Success', detail:'It updated correctly'});
      });
      
    }
    else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Data'});
    }
  }
}