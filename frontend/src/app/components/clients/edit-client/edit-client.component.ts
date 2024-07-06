import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialog } from '@angular/material/dialog';
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
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [MatToolbarModule,MatDialogModule,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatInputModule,MatSelectModule,MatDialogActions,MatButtonModule],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.css'
})
export class EditClientComponent {
  clientForm:any = FormGroup
  responseMessage:string = '';
  clientId: number;
  user:any= [];
  constructor(
    private formBuilder:FormBuilder,
    private clientService:ClientService,
    private snackbar:SnackbarService,
    private loader: NgxUiLoaderService,
    private dialogRef:MatDialogRef<EditClientComponent>,
    private authService:AuthService,
    @Inject(MAT_DIALOG_DATA) public data :any
  ){this.clientId = data.id}

  ngOnInit(): void {
    this.getClient(this.clientId);
    this.clientForm = this.formBuilder.group({
      name:['',[Validators.required]],
      lastname:['',[Validators.required]],
      dni:['',[Validators.required]],
      address:['',[Validators.required]],
      phone_number:['',[Validators.required]]
    })
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

  getClient(id:any){
    this.clientService.getClient(id).subscribe(
      response => {
        this.clientForm.patchValue({
          name: response.name,
          lastname: response.lastname,
          dni: response.dni,
          address: response.address,
          phone_number: response.phone_number
        });
      },err=>{
        console.log(err)
      }
    )
  }

  Submit(){
    this.loader.start()
    this.clientService.updateClient(this.clientId,this.clientForm.value).subscribe(
    (response)=>{
      console.log(this.clientForm.value);
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
