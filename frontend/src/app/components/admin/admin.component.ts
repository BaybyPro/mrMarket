import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatIcon } from '@angular/material/icon';
import moment from 'moment';
import { DashboardService } from '../../services/dashboard.service';
import { DialogConfig } from '@angular/cdk/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { SnackbarService } from '../../services/snackbar.service';
import { Global } from '../../models/global';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatIcon,MatDialogModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{

  admin: any = [];
  users: any = [];
  fecha:string = '';
  confirm:boolean = false;
  nameUser:string = '';
  idUser?:any;
  messageResponse:string='';
  constructor(
    private authService:AuthService,
    private dashboard:DashboardService,
    private dialog:MatDialog,
    private snackBar:SnackbarService,
    
  ){}

  ngOnInit(): void {
    this.fecha = moment().format('YYYY-MM');
    this.getAdmin();
    this.getUser();
  }

  getAdmin(){
    this.authService.getUser().subscribe(
      response=>{this.admin=response},
      err=>{}

    )
  }

  getUser(){
    this.dashboard.getDataUser(this.fecha).subscribe(
      response=>{
        this.users = response.users;
      },err=>{}
    );
  }
  addUser(){
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width="600px";
    dialogConfig.minHeight="300px"
    let dialogRef = this.dialog.open(AddAdminComponent,dialogConfig)

    dialogRef.afterClosed().subscribe(
      result=>{if(result){this.getUser();}}
    );
  }

  openDialog(name:any,id:any){
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width= "600px";
    dialogConfig.minHeight="300px";
    dialogConfig.data={name:name,id:id};
    let dialogRef = this.dialog.open(EditAdminComponent,dialogConfig)

    dialogRef.afterClosed().subscribe(
      result=>{if(result){this.getUser();}}
    );
  }
  openDelete(name:string,id:number){
    this.confirm = true;
    this.nameUser = name;
    this.idUser = id
  }
  confirmDelete(){
    this.authService.deleteUser(this.idUser).subscribe(
      response=>{
        this.snackBar.openSnackBar(response.message,'');
        this.confirm = false;
        this.getUser();
      },err=>{
        if(err.error.message){
          this.messageResponse = err.error.message
        }else{
          this.messageResponse = Global.genericError
        }
        this.snackBar.openSnackBar(this.messageResponse,'error')
      }
    )
  }
  closeConfirm(){this.confirm = false;}
}
