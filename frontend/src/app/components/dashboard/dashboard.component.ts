import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AuthService } from '../../services/auth.service';
import { RouterLinkActive } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterOutlet, MatIcon,NgxUiLoaderModule,RouterLinkActive,MatSidenavModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  user:any = [];
constructor(
  public authService: AuthService
){}

ngOnInit(): void {
  this.getUser();
}

getUser(){
  this.authService.getUser().subscribe(
    reponse=>{
      this.user = reponse
    },
    err=>{

    }
  )
}
}
