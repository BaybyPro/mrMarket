import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
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

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [MatToolbarModule,MatDialogModule,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatInputModule,MatSelectModule,MatDialogActions,MatButtonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {

  clientForm:any = FormGroup
  responseMessage:string = '';
  constructor(
    private formBuilder:FormBuilder,
    private clientService:ClientService,
    private snackbar:SnackbarService,
    private loader: NgxUiLoaderService,
    private dialogRef:MatDialogRef<CreateComponent>
  ){}

  ngOnInit(): void {
    this.clientForm = this.formBuilder.group({
      name:[null,[Validators.required]],
      lastname:[null,[Validators.required]],
      dni:[null,[Validators.required]],
      address:[null,[Validators.required]],
      phone_number:[null,[Validators.required]]
    })
  }

  Submit(){
    this.loader.start()
    this.clientService.addClient(this.clientForm.value).subscribe(
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
