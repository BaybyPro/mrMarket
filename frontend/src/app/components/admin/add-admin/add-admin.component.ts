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
import { DialogRef } from '@angular/cdk/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [MatIcon, MatInputModule, MatFormFieldModule, MatDialogActions, MatToolbarModule, MatDialogModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent {
  userForm:any = FormGroup;
  matTool:string = 'Registrar'
  success:string = 'Enviar'
  responseMessage:string = '';
  constructor (
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private snackbar:SnackbarService,
    public dialogRef: MatDialogRef<AddAdminComponent>,

  ){

  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name:['',[Validators.required,Validators.pattern(Global.datesId)]],
      password:['',Validators.required]
    });
  }
  submit(){
    this.authService.register(this.userForm.value).subscribe(
      response=>{
        this.snackbar.openSnackBar(response.message,'')
        this.dialogRef.close(true)
      },err=>{
        if(err.error.message){
          this.responseMessage = err.error.message;
        }else{
          this.responseMessage = Global.genericError;
        }
        this.snackbar.openSnackBar(this.responseMessage,'error')
      }
    )
  }


}
