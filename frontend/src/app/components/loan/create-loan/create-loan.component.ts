import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialogActions } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import {MatButtonModule} from '@angular/material/button';
import { ClientService } from '../../../services/client.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Global } from '../../../models/global';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {MatDatepickerModule} from '@angular/material/datepicker';

import moment from 'moment';
import { LoanService } from '../../../services/loan.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-loan',
  standalone: true,
  imports: [MatToolbarModule,MatDialogModule,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatInputModule,MatSelectModule,MatDialogActions,MatButtonModule,MatDatepickerModule],
  templateUrl: './create-loan.component.html',
  styleUrl: './create-loan.component.css'
})
export class CreateLoanComponent {
  loanForm:any = FormGroup
  responseMessage:string = '';
  fecha:string = '';
  user:any = [];
  clientId:number
  constructor(
    private formBuilder:FormBuilder,
    private clientService:ClientService,
    private loanService:LoanService,
    private snackbar:SnackbarService,
    private loader: NgxUiLoaderService,
    private dialogRef:MatDialogRef<CreateLoanComponent>,
    private authService:AuthService,
    @Inject(MAT_DIALOG_DATA) public data:any
  ){
    this.clientId = data.id
  }

  ngOnInit(): void {
    this.getUser();
    this.loanForm = this.formBuilder.group({
      amount:[null,[Validators.required]],
      date_start:[null,[Validators.required]],
      interest:[20,[Validators.required]]
    })
  }

  //cambia el formato de la fecha puesta en el form aceptable para el backend
  changeDatePicker(fecha:any){
    this.fecha = moment(fecha, 'MM/DD/YYYY').format('YYYY-MM-DD');
  }

  getUser(){
    this.authService.getUser().subscribe(
      response=>{
        this.user = response
      },
      err=>{
        console.log(err)
      }      
    );
  }

  Submit(){
    this.loader.start()
    var formData = this.loanForm.value;
    var data ={
      client_id:this.clientId,
      user_id:this.user.id,
      amount:formData.amount,
      date_start:this.fecha,
      interest:formData.interest
    }
    this.loanService.addLoan(data).subscribe(
    (response)=>{
      this.loader.stop()
      this.snackbar.openSnackBar(response?.message,"")
      this.dialogRef.close(true);
    },
    (err:any)=>{
      this.loader.stop()
      console.log(err.error.message)
      if(err.error.message){
        this.responseMessage = err.error?.message;
      }else{
        this.responseMessage = Global.genericError;
      }
      this.snackbar.openSnackBar(this.responseMessage,"error");
    })
  };

 

  
  close(){};
}
