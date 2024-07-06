import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { tokenGuard } from './guards/token.guard';
import { ClientsComponent } from './components/clients/clients.component';
import { LoanComponent } from './components/loan/loan.component';
import { OnloanComponent } from './components/loan/onloan/onloan.component';
import { DataComponent } from './components/data/data.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
    {path:'',component:LoginComponent},
    {path:'dashboard',component:DashboardComponent,canMatch:[tokenGuard],children:
        [{path:'',component:ClientsComponent},
         {path:'clients',component:ClientsComponent},
         {path:'loans',component:LoanComponent},
         {path:'onloans',component:OnloanComponent},
         {path:'data',component:DataComponent},
         {path:'admin',component:AdminComponent}],
    },
    {path:'**',component:LoginComponent}
];
