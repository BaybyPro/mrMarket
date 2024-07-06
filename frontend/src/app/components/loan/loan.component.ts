import { Component, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoanService } from '../../services/loan.service';
import { PayService } from '../../services/pay.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Tooltip, initTWE,Ripple } from 'tw-elements';
import { Global } from '../../models/global';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog,MatDialogConfig,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreatePayComponent } from '../pays/create-pay/create-pay.component';
import { ClientService } from '../../services/client.service';
@Component({
  selector: 'app-loan',
  standalone: true,
  imports: [MatExpansionModule,MatIcon,MatInputModule],
  templateUrl: './loan.component.html',
  styleUrl: './loan.component.css'
})
export class LoanComponent implements OnInit{
  loans:any=[]
  user: any = {};
  client:any={};
  pays:any=[];
  days:any=[];
  day:string='';
  id_pay?:number;
  paid?:number;
  updateDay: boolean = false;
  dataPaid:boolean = false;
  editpaid: boolean = true;
  admin:any= [];
  adminPaid:any=[];
  message:string='';
  selectedLoanId?: number;
 
  constructor(private loanService:LoanService,
    private payService:PayService,
    private clientService:ClientService,
    private authService:AuthService,
    private loader:NgxUiLoaderService,
    private snackbar:SnackbarService,
    private dialog:MatDialog
  ){

  }
  ngOnInit(): void {
    this.getLoans();
    this.getUser();
  }

  getLoans(){
    this.loanService.getLoans().subscribe(
      response=>{
        this.loans = response.data
      },
      err=>{
        console.log(err)
      }
    )
  }
  getPays(id:number,userId:number,client:number){
    this.selectedLoanId = id;
    this.clientService.getClient(client).subscribe(
      response=>{
        this.client = response
      },err=>{console.log("no se encontró usuario")}
    )
    this.authService.getUserById(userId).subscribe(
      response => {
        this.user= response[0];
      },
      err => {
        console.log(err);
      }
    );

    this.payService.getPaysActive(id).subscribe(
      response=>{
        this.pays = response
        this.days = response.map((items:any)=>{
          const splitDays = items.day.split('-');
          return splitDays;
        });
      },
      err=>{
        console.log(err)
      }
    )  
  }

  

  updatePay(id:number,day:any,paid:number){
    this.day = day;
    this.id_pay = id;
    this.paid = paid
    this.updateDay = !this.updateDay;
    this.editpaid = true
  };

  dayPaid(){
    this.loader.start()
    var data ={
      amount_paid:this.paid,
      status:2,
      user_id: this.admin.id
    }
    this.payService.updatePay(this.id_pay,data).subscribe(
      response=>{
        this.updateDay=false
        this.loader.stop();
        this.snackbar.openSnackBar(response.message,"")
        this.updateLoan();
      },err=>{
        this.loader.stop();
        if(err.error.message){
          this.message = err.error.message
        }else{
          this.message = Global.genericError
        }
        this.snackbar.openSnackBar(this.message,'error')
      }
    );
  }

  notPaid(){
    this.loader.start()
    var data ={
      amount_paid:this.paid,
      status:4,
      user_id: this.admin.id
    }
    this.payService.updatePay(this.id_pay,data).subscribe(
      response=>{
        this.snackbar.openSnackBar(response.message,"")
        this.updateDay = false
        this.loader.stop();
      },err=>{
        this.loader.stop();
        if(err.error.message){
          this.message = err.error.message
        }else{
          this.message = Global.genericError
        }
        this.snackbar.openSnackBar(this.message,'error')
      }
    );
  }
  editPaid(){
    this.editpaid = false
  }

  getUser(){
    this.authService.getUser().subscribe(
      response=>{
        this.admin = response
      },
      err=>{
        console.log(err)
      }      
    );
  }
  submitPaid(input:any){
    this.loader.start()
    var data ={
      amount_paid:input,
      status:3,
      user_id: this.admin.id
    }
    this.payService.updatePay(this.id_pay,data).subscribe(
      response=>{
        this.loader.stop();
        this.snackbar.openSnackBar(response.message,"")
        this.updateLoan();
      },err=>{
        this.loader.stop();
        if(err.error.message){
          this.message = err.error.message
        }else{
          this.message = Global.genericError
        }
        this.snackbar.openSnackBar(this.message,'error')
      }
    );
  }

 updateLoan(){
  this.loanService.getLoanById(this.selectedLoanId).subscribe(
    response=>{
      const updatedLoan = response[0];
          const loanIndex = this.loans.findIndex((loan:any) => loan.id === this.selectedLoanId);
          if (loanIndex !== -1) {
            this.loans[loanIndex] = updatedLoan;
          }
    },err=>{console.log(err)}
  );
 }

 showDataPaid(day:any,id:any){
  this.updateDay = false
  this.getAdminPaid(id);
  this.day = day;
  this.dataPaid = !this.dataPaid;
 }

 getAdminPaid(id:any){
  this.authService.getUserById(id).subscribe(
    response=>{
      this.adminPaid = response[0];
    },err=>{
      console.log(err)
    }
  )
 }

 openCreatePay(id:any){
  const dialogConfig = new MatDialogConfig();
    dialogConfig.width= "600px";
    dialogConfig.minHeight="300";
    dialogConfig.data={id:id,missing:0.00}
    let dialogRef = this.dialog.open(CreatePayComponent,dialogConfig)
    dialogRef.afterClosed().subscribe(result=>{
      if(result){this.updateLoan()}
    })
 }

 searchLoan(loanId:any){
  if(loanId==''){
    this.getLoans()
  }else{
    this.loanService.getLoanById(loanId).subscribe(
      response=>{
        this.loans = response
      },err=>{
        console.log(err)
      }
    )
  }
 }
}
