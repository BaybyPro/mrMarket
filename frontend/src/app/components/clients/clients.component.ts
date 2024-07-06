import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogConfig,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClientService } from '../../services/client.service';
import { MatIcon } from '@angular/material/icon';
import { CreateComponent } from './create/create.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import {MatMenuModule} from '@angular/material/menu';
import { CreateLoanComponent } from '../loan/create-loan/create-loan.component';
import { LoanClientComponent } from './loan-client/loan-client.component';
import { SnackbarService } from '../../services/snackbar.service';
import { Global } from '../../models/global';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [MatPaginatorModule, MatIconModule, MatInputModule, MatFormFieldModule,MatIcon,MatMenuModule,MatButtonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit{
  message: any;
  confirm: boolean = false;
  clients:any = [];
  count:any= 0;
  pageSize: number = 0;
  currentPage: number = 1;
  data:string='';
  responseMessage:string='';
  options = ['nombre', 'apellido', 'DNI','celular'];
  selectedOption = 'Filtrar por';
  constructor(private clientService:ClientService,
    private dialog:MatDialog,
    private snackBar:SnackbarService
  ){

  }

  ngOnInit(): void {
    this.getClient(this.currentPage);
  }

  getClient(page:number){
    this.clientService.getClients(page).subscribe(
      (response:any)=>{
        this.clients = response.data
        this.count = response.total
        this.pageSize = response.per_page
      },
      err=>{
        console.log(err)
      }
    );
  }
  onPageChange(event:any){
    this.currentPage = event.pageIndex + 1;
    this.getClient(this.currentPage);
  };

  add(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width="600px";
    dialogConfig.minHeight="300px";
    const dialogRef = this.dialog.open(CreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getClient(this.currentPage);
      }
    });
  };

  edit(id:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width="550px";
    dialogConfig.minHeight="300px";
    dialogConfig.data={id:id};
    let dialogRef = this.dialog.open(EditClientComponent,dialogConfig)
    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.getClient(this.currentPage);
      }
    })
  };

  addLoan(id:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width="550px";
    dialogConfig.minHeight="300px";
    dialogConfig.data={id:id};
    let dialogRef = this.dialog.open(CreateLoanComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result=>{
      if(result){this.getClient(this.currentPage);}
    })
  }

  openPays(id:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width= "1300px";
    dialogConfig.minHeight="300";
    dialogConfig.data={id:id}
    this.dialog.open(LoanClientComponent,dialogConfig)
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  onEnter(event: KeyboardEvent,text:any): void {
    if (event.key === 'Enter') {
      let dataFilter = ''
        if(this.selectedOption =='nombre'){dataFilter = 'name'}
        if(this.selectedOption =='apellido'){dataFilter = 'lastname'}
        if(this.selectedOption =='celular'){dataFilter = 'phone_number'}
        if(this.selectedOption =='DNI'){dataFilter = 'DNI'}
        this.clientService.getClientFilter(dataFilter,text).subscribe(
          response=>{
            this.clients = response;
          },err=>{
            if(err.error.message){
              this.responseMessage = err.error.message;
            }else{
              this.responseMessage = Global.genericError
            }
            this.snackBar.openSnackBar(this.responseMessage,"error")
          }
        )
    }
  }
  confirmDelete(){};
  cancelDelete(){};
  deleteEmployee(){};

  
  
}
