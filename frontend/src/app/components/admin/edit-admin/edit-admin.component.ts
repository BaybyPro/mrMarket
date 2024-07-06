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
  selector: 'app-edit-admin',
  standalone: true,
  imports: [MatIcon, MatInputModule, MatFormFieldModule, MatDialogActions, MatToolbarModule, MatDialogModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-admin.component.html',
  styleUrl: './edit-admin.component.css'
})
export class EditAdminComponent implements OnInit {
  userForm:any = FormGroup;
  matTool:string = 'Editar'
  success:string = 'Enviar'
  responseMessage:string = '';
  id:number;
  name:string;
  hide = true;
  hide2 = true;
  constructor (
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private snackbar:SnackbarService,
    private dialogRef:DialogRef,
    public dialogRefClose: MatDialogRef<EditAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data :any,
  ){
    this.id = data.id
    this.name = data.name
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name:[this.name,[Validators.required,Validators.pattern(Global.datesId)]],
      password:['',Validators.required],
      new_password:['',Validators.required]
    });
  }
  submit(){
    this.authService.editUser(this.userForm.value,this.id).subscribe(
      response=>{
        this.snackbar.openSnackBar(response.message,'')
        this.dialogRefClose.close(true)
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
  togglePasswordVisibility(): void {
    this.hide = !this.hide
  }

  togglePasswordVisibility2(): void {
    this.hide2 = !this.hide2
  }
}
