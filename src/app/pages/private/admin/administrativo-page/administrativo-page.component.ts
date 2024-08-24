import { PersonResponseAdapter } from './../../../../modules/person/adapters/PersonResponseAdapter';
import { ToastService } from './../../../../components/toast.service';
import { Component } from '@angular/core';
import { PersonService } from '../../../../services/person.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { FormBuilder, Validators } from '@angular/forms';
import { UserInsertUpdateAdapter } from '../../../../modules/person/adapters/UserInsertUpdateAdapter';
import { PersonInsertUpdateAdapter } from '../../../../modules/person/adapters/PersonInsertUpdateAdapter';
import { UserLoginAdapter } from '../../../../modules/person/adapters/UserLoginAdapter';
import { UserDeleteOrBlockAdapter } from '../../../../modules/person/adapters/UserDeleteOrBlockAdapter';
import { PersonDeleteAdapter } from '../../../../modules/person/adapters/PersonDeleteAdapter';

@Component({
  selector: 'app-administrativo-page',
  templateUrl: './administrativo-page.component.html',
  styleUrl: './administrativo-page.component.scss'
})
export class AdministrativoPageComponent {

  isloading = false;
  editPassword = false;
  allowedUpdate = false;

  userEditForm = this._formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dtNasc: [new Date, Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    rePassword: ['', Validators.required]
  });

  createUserForm = this._formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dtNasc: [undefined, Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    rePassword: ['', Validators.required]
  });

  allPersons: PersonResponseAdapter[] = []
  personsEnabled: PersonResponseAdapter[] = []
  personsDisabled: PersonResponseAdapter[] = []
  personsDeleted: PersonResponseAdapter[] = []
  personsAdm: PersonResponseAdapter[] = []
  menuOptionUserListitems: MenuItem[] = [];
  menuOptionSelectUserListItems: MenuItem[] = [];
  personsToList: any[] = []
  personSelected = new PersonResponseAdapter();

  showDialogListUsers = false;
  showDialogUpdateUser = false;
  showDialogCreateUser = false

  listUserFilter: string = ""
  typeListSelected = ""

  constructor(
    private _formBuilder: FormBuilder,
    private personService: PersonService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
  ) {

  }

  ngOnInit(): void {
    this.loadPersonsInfo()
    this.createMenuSelectListUser()
  }
  //Inicio inicialização basica

  loadPersonsInfo() {
    this.loadAllPersons();
  }

  getQuantityTypePersons() {
    this.checkUsersEnabled()
    this.checkUsersDisabled()
    this.checkUsersDeleted();
    this.checkUsersAdm()
  }

  async loadAllPersons() {
    this.clearAllListPersons();
    this.personService.getAll().subscribe(res => {
      console.log(res);
      this.allPersons = res;
      this.getQuantityTypePersons()
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Carregamendo de usuários", "Falha ao consultar usuários: Servidor com problemas");
      }
      console.log(error);
    })
  }

  clearAllListPersons() {
    this.allPersons = []
    this.personsEnabled = []
    this.personsDisabled = []
    this.personsDeleted = []
    this.personsAdm = []
  }

  checkUsersAdm() {
    if (this.allPersons.length > 0) {
      this.allPersons.forEach(item => {
        if (item.user.role.roleName === "admin") {
          this.personsAdm.push(item)
        }
      })
    }
  }

  checkUsersDeleted() {
    if (this.allPersons.length > 0) {
      this.allPersons.forEach(item => {
        if (item.user.deleted == true) {
          this.personsDeleted.push(item)
        }
      })
    }
  }

  checkUsersDisabled() {
    if (this.allPersons.length > 0) {
      this.allPersons.forEach(item => {
        if (item.user.deleted == true) {
          this.personsDisabled.push(item)
        }
      })
    }
  }

  checkUsersEnabled() {
    if (this.allPersons.length > 0) {
      this.allPersons.forEach(item => {
        if (item.user.blocked == false) {
          this.personsEnabled.push(item)
        }
      })
    }
  }

  createMenuSelectListUser() {
    this.menuOptionSelectUserListItems = [
      { label: "Todos", command: () => { this.openListaUsuarios(this.allPersons, 'Todos') } },
      { label: "Ativos", command: () => { this.openListaUsuarios(this.personsEnabled, 'Ativos') } },
      { label: "Bloqueados", command: () => { this.openListaUsuarios(this.personsDisabled, 'Bloqueados') } },
      { label: "Deletados", command: () => { this.openListaUsuarios(this.personsDeleted, 'Deletados') } },
      { label: "Administradores", command: () => { this.openListaUsuarios(this.personsAdm, 'Administradores') } }
    ]
  }

  //Fim inicialização basica

  //Inicio metodos para gerenciamento de Usuario

  openListaUsuarios(persons: PersonResponseAdapter[], tipoLista: string): void {
    this.personsToList = []
    persons.forEach(item => {
      let status = "";
      let block = "";
      if (item.user.blocked) {
        block = "Sim"
      } else {
        block = "não"
      }
      if (item.user.deleted) {
        status = "Desativado"
      }
      else {
        status = "Ativado"
      }
      this.personsToList.push({ username: item.user.username, name: item.name, status: status, block: block, typeUser: item.user.role.roleName })
    })
    this.typeListSelected = tipoLista;
    this.showDialogListUsers = true;

  }

  async refreshTable() {
    this.personsToList = []
    this.toastService.showToastInfo("Informação", "Atualizando tabela isso pode levar alguns segundos")
    this.clearAllListPersons();
    this.personService.getAll().subscribe(res => {
      console.log(res);
      this.allPersons = res;
      if (this.allPersons.length > 0) {
        this.allPersons.forEach(item => {
          if (item.user.blocked == false) {
            this.personsEnabled.push(item)
          }
        })
        this.allPersons.forEach(item => {
          if (item.user.deleted == true) {
            this.personsDisabled.push(item)
          }
        })
        this.allPersons.forEach(item => {
          if (item.user.deleted == true) {
            this.personsDeleted.push(item)
          }
        })
        this.allPersons.forEach(item => {
          if (item.user.role.roleName === "admin") {
            this.personsAdm.push(item)
          }
        })

        this.personsToList = []
        if (this.typeListSelected == "Todos") {
          this.openListaUsuarios(this.allPersons, this.typeListSelected)
        }
        if (this.typeListSelected == "Ativos") {
          this.openListaUsuarios(this.personsEnabled, this.typeListSelected)
        }
        if (this.typeListSelected == "Bloqueados") {
          this.openListaUsuarios(this.personsDisabled, this.typeListSelected)
        }
        if (this.typeListSelected == "Deletados") {
          this.openListaUsuarios(this.personsDeleted, this.typeListSelected)
        }
        if (this.typeListSelected == "Administradores") {
          this.openListaUsuarios(this.personsAdm, this.typeListSelected)
        }

      }

    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Carregamendo de usuários", "Falha ao consultar usuários: Servidor com problemas");
      }
      console.log(error);
    })
  }

  openMenuTableUser(event: any, menuOptionUserList: Menu, person: any) {
    this.menuOptionUserListitems = [];
    let filter = this.allPersons.find(f => f.name == person.name && f.user.username == person.username);
    if (filter != undefined) {
      this.personSelected = filter

      if (this.personSelected.user.role.roleCode == 0) {
        this.menuOptionUserListitems.push({ label: 'Tornar usuário comum', command: () => this.setTypeUser(1, event) })
      } else {
        this.menuOptionUserListitems.push({ label: 'Tornar administrador', command: () => this.setTypeUser(0, event) })
      }

      if (this.personSelected.user.blocked) {
        this.menuOptionUserListitems.push({ label: 'Desbloquear', command: () => this.setblocked(false, event) })
      } else {
        this.menuOptionUserListitems.push({ label: 'Bloquear', command: () => this.setblocked(true, event) })
      }

      if (this.personSelected.user.deleted) {
        this.menuOptionUserListitems.push({ label: 'Recuperar', command: () => this.setDisabled(false, event) })
      } else {
        this.menuOptionUserListitems.push({ label: 'deletar', command: () => this.setDisabled(true, event) })
      }
      this.menuOptionUserListitems.push({ label: 'Editar', command: () => this.editUser() })
    }

    menuOptionUserList.toggle(event)
  }

  editUser(): void {
    this.setFieldsUser();
    this.showDialogUpdateUser = true;

  }

  setDisabled(disabled: boolean, event: any): void {
    let userDelete = new UserDeleteOrBlockAdapter();
    let personDelete = new PersonDeleteAdapter();
    let messageConfirm = ""
    userDelete.idPublic = this.personSelected.user.id
    userDelete.username = this.personSelected.user.username;

    personDelete.idPublic = this.personSelected.id
    personDelete.email = this.personSelected.email
    personDelete.name = this.personSelected.name
    personDelete.user = userDelete;

    if (disabled) {
      messageConfirm = "Tem certeza que deseja deletar " + this.personSelected.user.username + "?";
    } else {
      messageConfirm = "Tem certeza que deseja recuperar " + this.personSelected.user.username + "?";
    }

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: messageConfirm,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (disabled) {
          this.personService.deletePerson(personDelete).subscribe(res => {
            this.toastService.showToastSuccess("Exclusão de usuário", "Usuário excluido com sucesso")
          }, error => {
            if (error.error != null) {
              this.toastService.showToastError(error.error.title, error.error.message);
            } else {
              this.toastService.showToastError("Exclusão de usuário", "Falha ao excluir usuário: Servidor com problemas");
            }
            console.log(error);
          })
        } else {
          this.personService.recoverPerson(personDelete).subscribe(res => {
            this.toastService.showToastSuccess("Recuperaçao de usuário", "Usuário recuperado com sucesso")
          }, error => {
            if (error.error != null) {
              this.toastService.showToastError(error.error.title, error.error.message);
            } else {
              this.toastService.showToastError("Recuperaçao de usuário", "Falha ao recuperar usuário: Servidor com problemas");
            }
            console.log(error);
          })
        }
      },
      reject: () => { this.toastService.showToastInfo("Confimação", "Operação cancelada") }
    })
  }

  setblocked(blocked: boolean, event: any): void {
    let user = new UserDeleteOrBlockAdapter()
    user.idPublic = this.personSelected.user.id
    user.username = this.personSelected.user.username
    let messageConfirm = ""
    if (blocked) {
      messageConfirm = "Tem certeza que deseja bloquear " + this.personSelected.user.username + "?";
    } else {
      messageConfirm = "Tem certeza que deseja desbloquear " + this.personSelected.user.username + "?";
    }

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: messageConfirm,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (blocked) {
          this.personService.blockPerson(user).subscribe(res => {
            this.toastService.showToastSuccess("Bloqueio de usuário", "Usuário bloqueado com sucesso")
          }, error => {
            if (error.error != null) {
              this.toastService.showToastError(error.error.title, error.error.message);
            } else {
              this.toastService.showToastError("Bloqueio de usuário", "Falha ao bloquear usuário: Servidor com problemas");
            }
            console.log(error);
          })
        } else {
          this.personService.unblockPerson(user).subscribe(res => {
            this.toastService.showToastSuccess("Desbloqueio de usuário", "Usuário desbloqueado com sucesso")
          }, error => {
            if (error.error != null) {
              this.toastService.showToastError(error.error.title, error.error.message);
            } else {
              this.toastService.showToastError("Desbloqueio de usuário", "Falha ao desbloquear usuário: Servidor com problemas");
            }
            console.log(error);
          })
        }
      },
      reject: () => { this.toastService.showToastInfo("Confimação", "Operação cancelada") }
    })
  }

  setTypeUser(typeUser: number, event: any): void {
    let messageConfirm = "";
    let userRole = ""
    if (typeUser == 0) {
      messageConfirm = "Tem certeza que deseja tornar " + this.personSelected.user.username + " um administrador?";
      userRole = "admin"
    }
    if (typeUser == 1) {
      messageConfirm = "Tem certeza que deseja tornar " + this.personSelected.user.username + " um usuário comum?";
      userRole = "user"
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: messageConfirm,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let user = new UserInsertUpdateAdapter();
        let p = new PersonInsertUpdateAdapter();

        user.idPublic = this.personSelected.user.id
        user.role = userRole
        user.username = this.personSelected.user.username

        p.birthday = this.personSelected.birthday
        p.email = this.personSelected.email
        p.idPublic = this.personSelected.id
        p.name = this.personSelected.name
        p.user = user;

        this.personService.updateTypeUser(p).subscribe(res => {
          this.toastService.showToastSuccess("Atualização de usuário", "Usuário atualizado com sucesso")
        }, error => {
          if (error.error != null) {
            this.toastService.showToastError(error.error.title, error.error.message);
          } else {
            this.toastService.showToastError("Atualização de usuário", "Falha ao atualizado usuário: Servidor com problemas");
          }
          console.log(error);
        })
      },
      reject: () => {
        this.toastService.showToastInfo("Confimação", "Operação cancelada")
      }
    })
  }

  filterUserList(e: any): string {
    this.listUserFilter = e.target.value
    return this.listUserFilter;
  }

  newUser() {
    this.showDialogCreateUser = true;
  }

  //Fim metodos para gerenciamento de Usuario

  //Inicio da logica de atualização de usuario
  updateUser() {
    console.log(this.personSelected);

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
    user.idPublic = this.personSelected.user.id

    let p = new PersonInsertUpdateAdapter();
    let date = this.userEditForm.get("dtNasc")?.value

    p.name = "" + this.userEditForm.get('name')?.value;
    p.email = "" + this.userEditForm.get('email')?.value;
    p.idPublic = this.personSelected.id

    if (date != undefined) {
      p.birthday = new Date(date).getTime();
    }

    if (this.editPassword) {
      user.password = this.personService.encript("" + this.userEditForm.get('password')?.value)
      p.user = user;
      this.personService.update(p).subscribe(response => {
        this.toastService.showToastSuccess("Atualização de usuário", "Usuário atualizado com sucesso")
        setTimeout(() => {
          this.isloading = false;
          this.showDialogUpdateUser = false;
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

    } else {
      p.user = user;
      this.personService.update(p).subscribe(response => {
        this.toastService.showToastSuccess("Atualização de usuário", "Usuário atualizado com sucesso")
        setTimeout(() => {
          this.isloading = false;
          this.showDialogUpdateUser = false;
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

  cancelPasswordUpdate() {
    this.editPassword = !this.editPassword
  }

  setFieldsUser() {
    this.userEditForm.get('name')?.setValue(this.personSelected.name)
    this.userEditForm.get('email')?.setValue(this.personSelected.email)
    this.userEditForm.get('dtNasc')?.setValue(new Date(this.personSelected.birthday))
    this.userEditForm.get('username')?.setValue(this.personSelected.user.username)
  }

  //Fim da logica de atualização de usuario

  //Inicio da Logica para criação de usuário

  registerUser() {
    if (this.createUserForm.get('name')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe seu nome");
      return
    }
    if (this.createUserForm.get('email')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe um email valido");
      return
    }
    if (this.createUserForm.get('dtNasc')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe sua data de nascimento");
      return
    }
    if (this.createUserForm.get('username')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe seu username");
      return
    }
    if (this.createUserForm.get('password')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe sua senha");
      return
    }
    if (this.createUserForm.get('rePassword')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe Confirme sua senha");
      return
    }
    if (this.createUserForm.get('rePassword')?.value != this.createUserForm.get('password')?.value) {
      this.toastService.showToastWarn("Campo inválido", "As senhas não são inguais");
      return
    }
    this.isloading = true;
    let user = new UserInsertUpdateAdapter();
    user.username = "" + this.createUserForm.get('username')?.value;
    user.password = (this.personService.encript("" + this.createUserForm.get('password')?.value));

    let person = new PersonInsertUpdateAdapter();
    let date = this.createUserForm.get("dtNasc")?.value

    person.name = "" + this.createUserForm.get('name')?.value;
    person.email = "" + this.createUserForm.get('email')?.value;
    person.user = user;
    if (date != undefined) {
      person.birthday = new Date(date).getTime();
    }

    this.personService.insert(person).subscribe(response => {
      this.toastService.showToastSuccess("Registro de usuário", "Usuário adicionado com sucesso")
      setTimeout(() => {
        this.isloading = false;
        this.showDialogCreateUser = false
        this.loadPersonsInfo()
      }, 1000);
    }, error => {
      if (error.error != null) {
        this.isloading = false;
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.isloading = false;
        this.toastService.showToastError("Registro de usuário", "Falha ao adicionar usuário: Servidor com problemas");
      }
      console.log(error);
      this.isloading = false;
    })
  }

  cancelCreateUser() {
    this.clearCreateUserFields()
    this.showDialogCreateUser = false
  }

  clearCreateUserFields() {
    this.createUserForm = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dtNasc: [undefined, Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      rePassword: ['', Validators.required]
    });
  }

  //Fim da Logica para criação de usuário

}
