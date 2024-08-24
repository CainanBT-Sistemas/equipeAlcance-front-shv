import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/public/login-page/login-page.component';
import { RegisterPageComponent } from './pages/public/register-page/register-page.component';
import { ToolbarComponent } from './components/pages/toolbar/toolbar.component';
import { MyAccountComponent } from './pages/private/my-account/my-account.component';

const routes: Routes = [
  { path: "", component: LoginPageComponent },
  { path: "register", component: RegisterPageComponent },
  { path: "app", component: ToolbarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
