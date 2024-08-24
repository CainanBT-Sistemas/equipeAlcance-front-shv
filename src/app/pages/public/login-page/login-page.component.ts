import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../components/toast.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PersonService } from '../../../services/person.service';
import { UserLoginAdapter } from '../../../modules/person/adapters/UserLoginAdapter';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  isloading = false;

  constructor(
    private route: Router,
    private _formBuilder: FormBuilder,
    private toast: ToastService,
    private personService:PersonService
  ){

  }

  loginForm = this._formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });


  login(){
    if (this.loginForm.get('username')?.valid == false) {
      this.toast.showToastWarn("Campo inválido", "Informe seu username");
      return;
    }
    if (this.loginForm.get('password')?.valid == false) {
      this.toast.showToastWarn("Campo inválido", "Informe sua senha");
      return;
    }
    this.isloading = true;
    let user = new UserLoginAdapter();
    user.username = "" + this.loginForm.get('username')?.value;
    user.password = this.personService.encript("" + (this.loginForm.get('password')?.value));

    this.personService.auth(user).subscribe(response => {
      this.toast.showToastSuccess("Login de usuário", "Login feito com sucesso");
      console.log(response);      
      setTimeout(() => {
        GlobalService.setPerson(response)
        this.route.navigate(['/app'])
        this.isloading = false;

      }, 1000);
    }, error => {
      if (error.error.code != null) {
        this.toast.showToastError(error.error.title, error.error.message);
      } else {
        this.toast.showToastError("Login de usuário", "Falha ao realizar login: Servidor com problemas");
      }
      console.log(error);
      this.isloading = false;
    })
  }

  register(){
    this.route.navigate(['register'])
  }
}
