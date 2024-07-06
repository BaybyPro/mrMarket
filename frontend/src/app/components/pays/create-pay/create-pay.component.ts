import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogModule, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PayService } from '../../../services/pay.service';
import { AuthService } from '../../../services/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../../services/snackbar.service';
import { Global } from '../../../models/global';
import moment from 'moment';

@Component({
  selector: 'app-create-pay',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatDialogActions, MatToolbarModule, MatDialogModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-pay.component.html',
  styleUrls: ['./create-pay.component.css']
})
export class CreatePayComponent implements OnInit {
  payForm:any = FormGroup;
  loanId: number;
  missing: number;
  PaysLader:any= [];
  user:any=[];
  admins:any=[];
  responseMessage:string= '';
  addPaid:boolean = true;
  constructor(private formBuilder: FormBuilder, 
    private matDialog: MatDialog,
    private payService:PayService,
    private authService:AuthService,
    private ngxUiloader:NgxUiLoaderService,
    private snackbar:SnackbarService,
    private dialogRef:MatDialogRef<CreatePayComponent>,
    @Inject(MAT_DIALOG_DATA) public data :any) 
    { this.loanId = data.id,
      this.missing = data.missing
    }

  ngOnInit(): void {
    if(this.missing < 0.99){
      this.addPaid = false
    }
    this.getUser();
    this.getPayLader();
    this.payForm = this.formBuilder.group({
      amount_paid: [null, [Validators.required]]
    });
  }

  getUser(){
    this.authService.getUser().subscribe(
      reponse=>{
        this.user = reponse
      },err=>{}
    )
  }

  getPayLader(){
    this.payService.getPaysLader(this.loanId).subscribe(
      response =>{
        // Extraer los IDs únicos de los administradores
      const adminIds = Array.from(new Set(response.map((pay: any) => pay.user_id)));
      const data = {ids:adminIds}
      // Obtener todos los administradores en una sola llamada
      this.authService.getUsersByIds(data).subscribe(
        (admins: any[]) => {
          const adminMap = new Map(admins.map(admin => [admin.id, admin.name]));

          this.PaysLader = response.map((pay: any) => {
            return {
              ...pay,
              admin: adminMap.get(pay.user_id) || 'Unknown'
            };
          });
        },
        err => {
          console.error(err);
        }
      );
    },
    err => {
      console.error(err);
    }
    );
  }

  addPayLader(){
    this.ngxUiloader.start();
    const pay = this.payForm.getRawValue()
    const data ={
      loan_id:this.loanId,
      day:moment().format('YYYY-MM-DD'),
      amount_paid: pay.amount_paid,
      status:5,
      user_id:this.user.id
    }
    this.payService.addPay(data).subscribe(
      response=>{
        this.ngxUiloader.stop();
        this.snackbar.openSnackBar(response?.message,"")
        this.dialogRef.close(true);
      },err=>{
        this.ngxUiloader.stop();
        if(err.error.message){
          this.responseMessage = err.error.message
        }else{
          this.responseMessage = Global.genericError
        }
        this.snackbar.openSnackBar(this.responseMessage,"error")
      }
    );
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
