
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Global } from '../../models/global';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  form: any = FormGroup;
  message:string = '';

  constructor(private  formBuilder:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private snackbart:SnackbarService,
    private loader:NgxUiLoaderService
  ) {
    
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name:'',
      password:''
    });
  }

  submit(){
    this.loader.start();
    this.authService.login(this.form.getRawValue()).subscribe(
      (response)=>{
          this.loader.stop();
          localStorage.setItem('token',response.token)
          this.router.navigate(['/dashboard']);
      },(err)=>{
        this.loader.stop();
         if(err.error.message){
          this.message = err.error.message;
         }else{
          this.message = Global.genericError;
         }
         this.snackbart.openSnackBar(this.message,'error')
      }
    )
  }
}
