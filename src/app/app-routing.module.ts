import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
{path:'',pathMatch:'full',component:HomePageComponent},
{path:'category/:categoryId',component:HomePageComponent},
{path:'login',component:LoginPageComponent},
{ path: 'products?_page=:page&_pageSize=:pageSize', component: HomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
