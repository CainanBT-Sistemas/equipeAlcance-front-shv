import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonService } from '../../../services/person.service';
import { GlobalService } from '../../../services/global.service';
import { UserInsertUpdateAdapter } from '../../../modules/person/adapters/UserInsertUpdateAdapter';
import { PersonInsertUpdateAdapter } from '../../../modules/person/adapters/PersonInsertUpdateAdapter';
import { PersonResponseAdapter } from '../../../modules/person/adapters/PersonResponseAdapter';
import { UserLoginAdapter } from '../../../modules/person/adapters/UserLoginAdapter';
import { ToastService } from '../../../components/toast.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent {
  isloading = false;
  editPassword = false;
  allowedUpdate = false;
  person = GlobalService.getPerson();
  userEditForm = this._formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dtNasc: [new Date, Validators.required],
    username: ['', Validators.required],
    passwordOld: ['', Validators.required],
    password: ['', Validators.required],
    rePassword: ['', Validators.required]
  });

  ngOnInit(): void {
    this.setFields();
  }
  setFields() {
    this.userEditForm.get('name')?.setValue(this.person.name)
    this.userEditForm.get('email')?.setValue(this.person.email)
    this.userEditForm.get('dtNasc')?.setValue(new Date(this.person.birthday))
    this.userEditForm.get('username')?.setValue(this.person.user.username)
  }

  constructor(
    private _formBuilder: FormBuilder,
    private route: Router,
    private toastService: ToastService,
    private service: PersonService,
  ) {
    if (!GlobalService.personLogged()) {
      this.route.navigate([''])
    }
  }

  update() {

    if (this.userEditForm.get('name')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe seu nome");
      return
    }
    if (this.userEditForm.get('email')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe um email valido");
      return
    }
    if (this.userEditForm.get('dtNasc')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe sua data de nascimento");
      return
    }
    if (this.userEditForm.get('username')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe seu username");
      return
    }

    if (this.editPassword) {
      if (this.userEditForm.get('passwordOld')?.valid == false) {
        this.toastService.showToastWarn("Campo inválido", "Informe sua senha antiga");
        return
      }
      if (this.userEditForm.get('password')?.valid == false) {
        this.toastService.showToastWarn("Campo inválido", "Informe sua senha nova");
        return
      }
      if (this.userEditForm.get('rePassword')?.valid == false) {
        this.toastService.showToastWarn("Campo inválido", "Informe Confirme sua senha nova");
        return
      }
      if (this.userEditForm.get('rePassword')?.value != this.userEditForm.get('password')?.value) {
        this.toastService.showToastWarn("Campo inválido", "As senhas não são inguais");
        return
      }
    }

    this.isloading = true;

    let user = new UserInsertUpdateAdapter();
    user.username = "" + this.userEditForm.get('username')?.value;
    user.idPublic = this.person.user.id
    user.role = this.person.user.role.roleCode;

    let p = new PersonInsertUpdateAdapter();
    let date = this.userEditForm.get("dtNasc")?.value

    p.name = "" + this.userEditForm.get('name')?.value;
    p.email = "" + this.userEditForm.get('email')?.value;
    p.idPublic = this.person.id

    if (date != undefined) {
      p.birthday = new Date(date).getTime();
    }

    if (this.editPassword) {
      let confirmIdentity = new UserLoginAdapter();
      confirmIdentity.username = GlobalService.getPerson().user.username
      confirmIdentity.password = this.service.encript("" + this.userEditForm.get('passwordOld')?.value);

      this.service.auth(confirmIdentity).subscribe(result => {
        if (result != null && result.id.trim().length > 0) {
          user.password = (this.service.encript("" + this.userEditForm.get('password')?.value));
          p.user = user;
          this.service.update(p).subscribe(response => {
            this.toastService.showToastSuccess("Atualização de usuário", "Usuário atualizado com sucesso")
            setTimeout(() => {
              this.isloading = false;
              this.logout()
            }, 1000);
          }, error => {
            if (error.error != null) {
              this.isloading = false;
              this.toastService.showToastError(error.error.title, error.error.message);
            } else {
              this.isloading = false;
              this.toastService.showToastError("Atualização de usuário", "Falha ao atualizado usuário: Servidor com problemas");
            }
            console.log(error);
            this.isloading = false;
          })
        }
      }, error => {
        if (error.error.code != null) {
          this.toastService.showToastError(error.error.title, error.error.message);
        } else {
          this.toastService.showToastError("Autenticação de usuário", "Falha ao realizar autenticação: Servidor com problemas");
        }
        console.log(error);
        this.isloading = false;
      })
    } else {
      p.user = user;
      this.service.update(p).subscribe(response => {
        this.toastService.showToastSuccess("Atualização de usuário", "Usuário atualizado com sucesso")
        setTimeout(() => {
          this.isloading = false;
          this.logout()
        }, 1000);
      }, error => {
        if (error.error != null) {
          this.isloading = false;
          this.toastService.showToastError(error.error.title, error.error.message);
        } else {
          this.isloading = false;
          this.toastService.showToastError("Atualização de usuário", "Falha ao atualizado usuário: Servidor com problemas");
        }
        console.log(error);
        this.isloading = false;
      })
    }
  }

  logout() {
    GlobalService.setPerson(new PersonResponseAdapter());
    this.route.navigate(['']);
  }

  cancelPasswordUpdate() {
    this.editPassword = !this.editPassword
  }


}
