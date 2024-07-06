import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { forkJoin } from 'rxjs';
import moment from 'moment';
import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [MatDatepicker],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent implements OnInit {

  data:any = {};
  dataMonth:any = {};
  dataday:any = {};
  fecha:string = '';
  day:string = '';
  pays:any=[];
  loans:any=[];
  paysAdmin:any=[];
  constructor(
    private dashboard:DashboardService,
    private authService:AuthService,
    private clienService:ClientService
  ){

  }


  ngOnInit(): void {
    this.getData()
    this.fecha = moment().format('YYYY-MM');
    this.day = moment().format('YYYY-MM-DD');
    this.getDataByMonth(this.fecha);
    this.geyDatabyDay(this.day);
  }

  getData(){
    this.dashboard.getData().subscribe(
      response=>{
        this.data = response;
      },err=>{

      }
    );
  } 

  getDataByMonth(date:string){
    this.dashboard.getDataByMonth(date).subscribe(
      response=>{
        this.dataMonth = response
      },err=>{}
    )
  }

  geyDatabyDay(day:string){
    this.dashboard.getDataByDay(day).subscribe(
      (response:any)=>{
        this.dataday = response;
        this.pays = response.data_earned;
        this.loans = response.data_loans;
        // Obtener los IDs de usuario únicos del response
        const userIdsP = response.data_earned.map((pay: any) => pay.user_id);
        const userIdsL = response.data_loans.map((loan: any) => loan.user_id);
        const dataP = {ids:userIdsP}
        const dataL = {ids:userIdsL}
        this.authService.getUsersByIds(dataP).subscribe(
          (admins:any)=>{
            const adminMap = new Map(admins.map((admin: any) => [admin.id, admin.name]));
            // Mapear los nombres de usuario a los pagos
            this.pays = this.pays.map((pay: any) => {
              return {
                  ...pay,
                  userName: adminMap.get(pay.user_id) || 'Unknown' // Asignar el nombre de usuario o 'Unknown' si no se encuentra
              };
          });
          },err=>{})
          this.authService.getUsersByIds(dataL).subscribe(
            (admins:any)=>{
              const adminMap = new Map(admins.map((admin: any) => [admin.id, admin.name]));
              // Mapear los nombres de usuario a los pagos
              this.loans = this.loans.map((loan: any) => {
                return {
                    ...loan,
                    userName: adminMap.get(loan.user_id) || 'Unknown' // Asignar el nombre de usuario o 'Unknown' si no se encuentra
                };
            });
            },err=>{})
      },err=>{}
    )
  }

  updateDate(date:any){
    this.dashboard.getDataByMonth(date).subscribe(
      response=>{
        this.dataMonth = response
      },err=>{}
    )
  }

  updateDay(day:string){
    this.dashboard.getDataByDay(day).subscribe(
      response=>{
        this.dataday = response;
        this.pays = response.data_earned;
        this.loans = response.data_loans;
        // Obtener los IDs de usuario únicos del response
        const userIdsP = response.data_earned.map((pay: any) => pay.user_id);
        const userIdsL = response.data_loans.map((loan: any) => loan.user_id);
        const dataP = {ids:userIdsP}
        const dataL = {ids:userIdsL}
        this.authService.getUsersByIds(dataP).subscribe(
          (admins:any)=>{
            const adminMap = new Map(admins.map((admin: any) => [admin.id, admin.name]));
            // Mapear los nombres de usuario a los pagos
            this.pays = this.pays.map((pay: any) => {
              return {
                  ...pay,
                  userName: adminMap.get(pay.user_id) || 'Unknown' // Asignar el nombre de usuario o 'Unknown' si no se encuentra
              };
          });
          },err=>{})
          this.authService.getUsersByIds(dataL).subscribe(
            (admins:any)=>{
              const adminMap = new Map(admins.map((admin: any) => [admin.id, admin.name]));
              // Mapear los nombres de usuario a los pagos
              this.loans = this.loans.map((loan: any) => {
                return {
                    ...loan,
                    userName: adminMap.get(loan.user_id) || 'Unknown' // Asignar el nombre de usuario o 'Unknown' si no se encuentra
                };
            });
            },err=>{})
      },err=>{}
    )
  }
}
