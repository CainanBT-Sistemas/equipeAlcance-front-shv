import { ToastService } from './../../../components/toast.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserInsertUpdateAdapter } from '../../../modules/person/adapters/UserInsertUpdateAdapter';
import { PersonService } from '../../../services/person.service';
import { PersonInsertUpdateAdapter } from '../../../modules/person/adapters/PersonInsertUpdateAdapter';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {

  isloading = false;
  registerForm = this._formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dtNasc: [undefined, Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    rePassword: ['', Validators.required]
  });

  constructor(
    private _formBuilder: FormBuilder,
    private route: Router,
    private toastService: ToastService,
    private service: PersonService,
  ) { }

  register() {
    if (this.registerForm.get('name')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido","Informe seu nome");
      return
    }
    if (this.registerForm.get('email')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido","Informe um email valido");
      return
    }
    if (this.registerForm.get('dtNasc')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido","Informe sua data de nascimento");
      return
    }
    if (this.registerForm.get('username')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido","Informe seu username");
      return
    }
    if (this.registerForm.get('password')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido","Informe sua senha");
      return
    }
    if (this.registerForm.get('rePassword')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido","Informe Confirme sua senha");
      return
    }
    if (this.registerForm.get('rePassword')?.value != this.registerForm.get('password')?.value) {
      this.toastService.showToastWarn("Campo inválido","As senhas não são inguais");
      return
    }
    this.isloading = true;
    let user = new UserInsertUpdateAdapter();
    user.username = "" + this.registerForm.get('username')?.value;
    user.password = (this.service.encript("" + this.registerForm.get('password')?.value));

    let person = new PersonInsertUpdateAdapter();
    let date = this.registerForm.get("dtNasc")?.value

    person.name = "" + this.registerForm.get('name')?.value;
    person.email = "" + this.registerForm.get('email')?.value;
    person.user = user;
    if(date != undefined){
      person.birthday = new Date(date).getTime();
    }

    this.service.insert(person).subscribe(response => {
      this.toastService.showToastSuccess("Registro de usuário","Usuário adicionado com sucesso")
      setTimeout(()=>{
        this.isloading = false;
      this.route.navigate(['']);
      }, 1000);
    }, error => {
      if (error.error != null) {
        this.isloading = false;
        this.toastService.showToastError(error.error.title,error.error.message);
      } else {
        this.isloading = false;
        this.toastService.showToastError("Registro de usuário","Falha ao adicionar usuário: Servidor com problemas");
      }
      console.log(error);
      this.isloading = false;
    })
  }

  cancel() {
    this.route.navigate([''])
  }
}
