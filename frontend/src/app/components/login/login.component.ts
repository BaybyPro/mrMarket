
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  form: any = FormGroup;

  constructor(private  formBuilder:FormBuilder,
    private authService:AuthService,
    private router:Router
  ) {
    
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name:'',
      password:''
    });
  }

  submit(){
    this.authService.login(this.form.getRawValue()).subscribe(
      (response)=>{
          localStorage.setItem('token',response.token)
          this.router.navigate(['/dashboard']);
      },(err)=>{
        console.log(err)
      }
    )
  }
}
