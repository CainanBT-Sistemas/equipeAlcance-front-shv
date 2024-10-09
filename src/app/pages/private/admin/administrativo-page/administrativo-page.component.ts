import { ScheduleFormPerson } from './../../../../modules/schedule-person/adapters/ScheduleFormPerson';
import { PlataformsAdapter } from './../../../../modules/streams/adapters/PlataformsAdapter';
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
import { StreamsService } from '../../../../services/streams.service';
import { SchedulePersonService } from '../../../../services/schedule-person.service';
import { SchedulePersonResponseAdapter } from '../../../../modules/schedule-person/adapters/SchedulePersonResponseAdapter';
import { HorariosModel } from '../../../../modules/utils/horariosModel';
import { LiveScheduleService } from '../../../../services/live-schedule.service';
import { LiveScheduleAdapter } from '../../../../modules/live-schedule/LiveScheduleAdapter';
import { DateUtilsService } from '../../../../services/date-utils.service';
import { filter } from 'rxjs';
import { PersonCamDoLiveAdapter } from '../../../../modules/person/adapters/PersonCamDoLiveAdapter';

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

  createPlataformForm = this._formBuilder.group({
    namePlataform: ['', Validators.required],
    urlPlataform: ['', [Validators.required]]
  });

  createScheduleLiveForm = this._formBuilder.group({
    dateOfScehdule: [new Date(), Validators.required],
    streamerToSchedule: [new PersonCamDoLiveAdapter(), Validators.required]
  });

  allPersons: PersonResponseAdapter[] = []
  personsEnabled: PersonResponseAdapter[] = []
  personsDisabled: PersonResponseAdapter[] = []
  personsDeleted: PersonResponseAdapter[] = []
  personsAdm: PersonResponseAdapter[] = []
  menuOptionUserListitems: MenuItem[] = [];
  menuOptiontPlatformListItems: MenuItem[] = [];
  menuOptiontSchedulePersonListItems: MenuItem[] = [];
  menuOptionSelectUserListItems: MenuItem[] = [];
  menuOptionSelectPlatformListItems: MenuItem[] = [];
  menuOptionSelectSchedulePersonListItems: MenuItem[] = [];
  personsToList: any[] = []
  personSelected = new PersonResponseAdapter();

  allPlataforms: PlataformsAdapter[] = []
  enabledPlataforms: PlataformsAdapter[] = []
  desenabledPlataforms: PlataformsAdapter[] = []
  plataformsToList: any[] = []
  plataformSelected = new PlataformsAdapter();

  scheduleFormPerson: ScheduleFormPerson[] = []
  scheduleFormPersonCompleted: ScheduleFormPerson[] = []
  scheduleFormPersonUncompleted: ScheduleFormPerson[] = []
  scheduleFormPersonToList: any[] = []
  scheduleFormPersonSelected: ScheduleFormPerson = new ScheduleFormPerson();

  personsCanDoLive: PersonCamDoLiveAdapter[] = [];
  schedulesOfDaySelected: LiveScheduleAdapter[] = []
  schedulesOfDayToDelete: LiveScheduleAdapter[] = []
  schedulesOfBeforeDaySelected: LiveScheduleAdapter[] = []
  preSchedule: LiveScheduleAdapter[] = []
  schedulesOfDayToList: any[] = []
  dateSelected: number = 0;

  showDialogListUsers = false;
  showDialogUpdateUser = false;
  showDialogCreateUser = false
  showDialogCreatePlataforms = false;
  showDialogUpdatePlataform = false;
  showDialogListPlataform = false
  showDialogListSchedulePerson = false
  showDialogSchedulePerson = false
  showDialogCreateSchedulesLive = false
  showDialogRegisterSchedulesLiveForm = false



  listUserFilter: string = ""
  listPlataformFilter: string = ""
  listSchedulePersonFilter: string = ""
  listScheduleOfDayToList: string = ""
  typeListUserSelected = ""
  typeListPlatformSelected = ""
  typeListScheduleFormPersonSelected = ""
  selectedDate = "Não selecionado"
  timeSelected: string = ""

  horariosDomingo: HorariosModel[] = [];
  horariosSegunda: HorariosModel[] = [];
  horariosTerca: HorariosModel[] = [];
  horariosQuarta: HorariosModel[] = [];
  horariosQuinta: HorariosModel[] = [];
  horariosSexta: HorariosModel[] = [];
  horariosSabado: HorariosModel[] = [];
  listHoursSchedule: string[] = [
    "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
    "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
  ]
  minDate: Date | undefined;
  maxDate: Date | undefined;


  constructor(
    private _formBuilder: FormBuilder,
    private personService: PersonService,
    private streamsService: StreamsService,
    private schedulePersonService: SchedulePersonService,
    private liveScheduleService: LiveScheduleService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
  ) {

  }

  ngOnInit(): void {
    this.configUsersInfo()
    this.configPlataformsInfo()
  }

  refreshAll() {
    this.configUsersInfo();
    this.configPlataformsInfo()
    this.loadLists()
  }

  //Inicio metodos para gerenciamento de Usuario

  configUsersInfo() {
    this.loadPersonsInfo()
    this.createMenuSelectListUser()
  }

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
      this.allPersons = []
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
    this.personsAdm = []
    if (this.allPersons.length > 0) {
      this.allPersons.forEach(item => {
        if (item.user.role.roleName === "admin") {
          this.personsAdm.push(item)
        }
      })
    }
  }

  checkUsersDeleted() {
    this.personsDeleted = []
    if (this.allPersons.length > 0) {
      this.allPersons.forEach(item => {
        if (item.user.deleted == true) {
          this.personsDeleted.push(item)
        }
      })
    }
  }

  checkUsersDisabled() {
    this.personsDisabled = []
    if (this.allPersons.length > 0) {
      this.allPersons.forEach(item => {
        if (item.user.deleted == true) {
          this.personsDisabled.push(item)
        }
      })
    }
  }

  checkUsersEnabled() {
    this.personsEnabled = []
    if (this.allPersons.length > 0) {
      this.allPersons.forEach(item => {
        if (item.user.blocked == false) {
          this.personsEnabled.push(item)
        }
      })
      this.configSchedulePersonsInfo();
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
    this.typeListUserSelected = tipoLista;
    this.showDialogListUsers = true;

  }

  async refreshTableUser() {
    this.refreshAll()
    this.personsToList = []
    this.toastService.showToastInfo("Informação", "Atualizando tabela isso pode levar alguns segundos")
    this.clearAllListPersons();
    this.personService.getAll().subscribe(res => {
      console.log(res);
      this.allPersons = []
      this.allPersons = res;
      this.personsEnabled = []
      this.personsDisabled = []
      this.personsDeleted = []
      this.personsAdm = []
      if (this.allPersons.length > 0) {
        this.allPersons.forEach(item => {
          if (item.user.blocked == false) {
            this.personsEnabled.push(item)
          }
          if (item.user.blocked == true) {
            this.personsDisabled.push(item)
          }
          if (item.user.deleted == true) {
            this.personsDeleted.push(item)
          }
          if (item.user.role.roleName === "admin") {
            this.personsAdm.push(item)
          }
        })

        this.scheduleFormPerson = [];
        this.scheduleFormPersonCompleted = [];
        this.scheduleFormPersonUncompleted = [];
        this.personsEnabled.forEach(async person => {
          let adapter = new PersonInsertUpdateAdapter()
          adapter.idPublic = person.id;
          this.schedulePersonService.getAllSchedulePersonByPerson(adapter).subscribe(res => {
            if (res.length > 0) {
              this.scheduleFormPersonCompleted.push({ person: person, schedules: res })
            } else {
              this.scheduleFormPersonUncompleted.push({ person: person, schedules: res })
            }
            this.scheduleFormPerson.push({ person: person, schedules: res });
          }, error => {
            if (error.error != null) {
              this.toastService.showToastError(error.error.title, error.error.message);
            } else {
              this.toastService.showToastError("Registro de agenda de usuário", "Falha ao consultar agenda de usuário: Servidor com problemas");
            }
            console.log(error);
          });
        })

        this.makeMenuOptionSelectSchedulePersonListItems()
        this.personsToList = []
        if (this.typeListUserSelected == "Todos") {
          this.openListaUsuarios(this.allPersons, this.typeListUserSelected)
        }
        if (this.typeListUserSelected == "Ativos") {
          this.openListaUsuarios(this.personsEnabled, this.typeListUserSelected)
        }
        if (this.typeListUserSelected == "Bloqueados") {
          this.openListaUsuarios(this.personsDisabled, this.typeListUserSelected)
        }
        if (this.typeListUserSelected == "Deletados") {
          this.openListaUsuarios(this.personsDeleted, this.typeListUserSelected)
        }
        if (this.typeListUserSelected == "Administradores") {
          this.openListaUsuarios(this.personsAdm, this.typeListUserSelected)
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
            this.refreshTableUser()
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
            this.refreshTableUser()
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
            this.refreshTableUser()
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
            this.refreshTableUser()
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
    let userRoleCode = 1
    if (typeUser == 0) {
      messageConfirm = "Tem certeza que deseja tornar " + this.personSelected.user.username + " um administrador?";
      userRoleCode = 0
    }
    if (typeUser == 1) {
      messageConfirm = "Tem certeza que deseja tornar " + this.personSelected.user.username + " um usuário comum?";
      userRoleCode = 1
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: messageConfirm,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let user = new UserInsertUpdateAdapter();
        let p = new PersonInsertUpdateAdapter();

        user.idPublic = this.personSelected.user.id
        user.role = userRoleCode
        user.username = this.personSelected.user.username

        p.birthday = this.personSelected.birthday
        p.email = this.personSelected.email
        p.idPublic = this.personSelected.id
        p.name = this.personSelected.name
        p.user = user;

        this.personService.updateTypeUser(p).subscribe(res => {
          this.toastService.showToastSuccess("Atualização de usuário", "Usuário atualizado com sucesso")
          this.refreshTableUser()
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
    user.role = this.personSelected.user.role.roleCode;
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
        this.refreshAll()
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
        this.refreshAll()
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
      this.refreshAll()
      setTimeout(() => {
        this.isloading = false;
        this.showDialogCreateUser = false
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
  //Fim metodos para gerenciamento de Usuario

  //Inicio metodos para ggerenciamento de plataformas
  configPlataformsInfo() {
    this.createMenuOptionSelectPlatformListItems();
    this.loadAllPlataforms();
  }

  loadAllPlataforms() {
    this.allPlataforms = []
    this.streamsService.findAllStreamsPlataforms().subscribe(res => {
      this.allPlataforms = res;
      console.log(this.allPlataforms);

      this.separePlatformsByStatus();
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Carregamendo de plataformas", "Falha ao consultar plataformas: Servidor com problemas");
      }
      console.log(error);
    })
  }

  separePlatformsByStatus() {
    this.enabledPlataforms = [];
    this.desenabledPlataforms = []
    this.allPlataforms.forEach(item => {
      if (item.active) {
        this.enabledPlataforms.push(item)
      } else {
        this.desenabledPlataforms.push(item)
      }
    })
  }

  createMenuOptionSelectPlatformListItems() {
    this.menuOptionSelectPlatformListItems = [
      { label: "Todas", command: () => { this.openListPlataform(this.allPlataforms, "todas") } },
      { label: "Ativadas", command: () => { this.openListPlataform(this.enabledPlataforms, "ativadas") } },
      { label: "Desativadas", command: () => { this.openListPlataform(this.desenabledPlataforms, "desativadas") } },
    ]
  }

  openListPlataform(list: PlataformsAdapter[], tipoLista: string) {
    this.plataformsToList = [];
    list.forEach(item => {
      let status = "";
      if (item.active) {
        status = "Ativado"
      } else {
        status = "Desativado"
      }
      this.plataformsToList.push({ name: item.name, url: item.urlBase, status: status })
    })
    this.typeListPlatformSelected = tipoLista;
    this.showDialogListPlataform = true;

  }

  newPlatform() {
    this.showDialogCreatePlataforms = true;
  }

  cancelCreatePlataform() {
    this.clearFieldsCreatePlataform();
    this.showDialogCreatePlataforms = false;
    this.showDialogUpdatePlataform = false;
  }

  clearFieldsCreatePlataform() {
    this.createPlataformForm = this._formBuilder.group({
      namePlataform: ['', Validators.required],
      urlPlataform: ['', [Validators.required]]
    });
  }

  registerPlataform() {
    if (this.createPlataformForm.get('namePlataform')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe um nome");
      return
    }

    if (this.createPlataformForm.get('urlPlataform')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe uma URL");
      return
    }
    this.isloading = true;
    let adapter = new PlataformsAdapter();

    adapter.name = "" + this.createPlataformForm.get('namePlataform')?.value;
    adapter.urlBase = "" + this.createPlataformForm.get('urlPlataform')?.value;

    this.streamsService.registerPlataform(adapter).subscribe(res => {
      this.toastService.showToastSuccess("Registro de plataforma", "Plataforma adicionado com sucesso")
      this.refreshTablePlataform()
      setTimeout(() => {
        this.isloading = false;
        this.showDialogCreatePlataforms = false
      }, 1000);
    }, error => {
      if (error.error != null) {
        this.isloading = false;
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.isloading = false;
        this.toastService.showToastError("Registro de plataforma", "Falha ao adicionar plataforma: Servidor com problemas");
      }
      console.log(error);
      this.isloading = false;
    })
  }

  updatePlataform() {
    if (this.createPlataformForm.get('namePlataform')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe um nome");
      return
    }

    if (this.createPlataformForm.get('urlPlataform')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe uma URL");
      return
    }
    this.isloading = true;
    let adapter = new PlataformsAdapter();
    adapter.idPublic = this.plataformSelected.idPublic;
    adapter.name = "" + this.createPlataformForm.get('namePlataform')?.value;
    adapter.urlBase = "" + this.createPlataformForm.get('urlPlataform')?.value;
    this.streamsService.updatePlataform(adapter).subscribe(res => {
      this.toastService.showToastSuccess("Atualização de plataforma", "Plataforma atualizada com sucesso")
      this.refreshTablePlataform()
      setTimeout(() => {
        this.isloading = false;
        this.showDialogUpdatePlataform = false
      }, 1000);
    }, error => {
      if (error.error != null) {
        this.isloading = false;
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.isloading = false;
        this.toastService.showToastError("Atualização de plataforma", "Falha ao atualizar plataforma: Servidor com problemas");
      }
      console.log(error);
      this.isloading = false;
    })
  }

  refreshTablePlataform() {
    this.plataformsToList = []
    this.toastService.showToastInfo("Informação", "Atualizando tabela isso pode levar alguns segundos")
    this.clearAllListPlataforms();
    this.streamsService.findAllStreamsPlataforms().subscribe(res => {
      this.allPlataforms = res;
      console.log(res);
      this.allPlataforms.forEach(item => {
        if (item.active) {
          this.enabledPlataforms.push(item)
        } else {
          this.desenabledPlataforms.push(item)
        }
      })
      if (this.typeListPlatformSelected == "todas") {
        this.openListPlataform(this.allPlataforms, this.typeListPlatformSelected)
      }
      if (this.typeListPlatformSelected == "ativadas") {
        this.openListPlataform(this.enabledPlataforms, this.typeListPlatformSelected)
      }
      if (this.typeListPlatformSelected == "desativadas") {
        this.openListPlataform(this.desenabledPlataforms, this.typeListPlatformSelected)
      }
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Carregamendo de plataformas", "Falha ao consultar plataformas: Servidor com problemas");
      }
      console.log(error);
    })
  }

  clearAllListPlataforms() {
    this.allPlataforms = []
    this.enabledPlataforms = []
    this.desenabledPlataforms = []
  }

  filterPlataformList(e: any): any {
    this.listPlataformFilter = e.target.value
    return this.listPlataformFilter;
  }

  openMenuTablePlatform(event: any, menuOptionSelectPlatformListItems: Menu, platform: any) {
    this.menuOptiontPlatformListItems = [];
    let filter = this.allPlataforms.find(f => f.name == platform.name && f.urlBase == platform.url);
    if (filter != undefined) {
      this.plataformSelected = filter
      if (this.plataformSelected.active) {
        this.menuOptiontPlatformListItems.push({ label: "Desativar", command: () => this.setStatusPlataform(false, event) })
      } else {
        this.menuOptiontPlatformListItems.push({ label: "Ativar", command: () => this.setStatusPlataform(true, event) })
      }
      this.menuOptiontPlatformListItems.push({ label: "Editar", command: () => this.editPlatform() })
    }

    menuOptionSelectPlatformListItems.toggle(event)
  }

  editPlatform(): void {
    this.setFieldsPlataform();
    this.showDialogUpdatePlataform = true;
  }

  setFieldsPlataform() {
    this.createPlataformForm = this._formBuilder.group({
      namePlataform: [this.plataformSelected.name, Validators.required],
      urlPlataform: [this.plataformSelected.urlBase, [Validators.required]]
    });
  }

  setStatusPlataform(active: boolean, event: any): void {
    let messageConfirm = "";
    if (active) {
      messageConfirm = "Tem certeza que deseja desativar a plataforma " + this.plataformSelected.name + "?"
    } else {
      messageConfirm = "Tem certeza que deseja ativar a plataforma " + this.plataformSelected.name + "?"
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: messageConfirm,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let adapter = new PlataformsAdapter();
        adapter.active = active
        adapter.idPublic = this.plataformSelected.idPublic
        adapter.name = this.plataformSelected.name
        adapter.urlBase = this.plataformSelected.urlBase
        console.log(active);
        if (!active) {
          this.streamsService.disablePlataformPlataform(adapter).subscribe(res => {
            this.toastService.showToastSuccess("Atualização de plataforma", "Plataforma atualizado com sucesso")
            this.refreshTablePlataform()
          }, error => {
            if (error.error != null) {
              this.toastService.showToastError(error.error.title, error.error.message);
            } else {
              this.toastService.showToastError("Atualização de plataforma", "Falha ao atualizar plataforma: Servidor com problemas");
            }
            console.log(error);
          })
        } else {
          this.streamsService.enablePlataform(adapter).subscribe(res => {
            this.toastService.showToastSuccess("Atualização de plataforma", "Plataforma atualizado com sucesso")
            this.refreshTablePlataform()
          }, error => {
            if (error.error != null) {
              this.toastService.showToastError(error.error.title, error.error.message);
            } else {
              this.toastService.showToastError("Atualização de plataforma", "Falha ao atualizar plataforma: Servidor com problemas");
            }
            console.log(error);
          })
        }

      },
      reject: () => { this.toastService.showToastInfo("Confimação", "Operação cancelada") }
    })
  }

  //Fim metodos para ggerenciamento de plataformas

  //Inicio metodos para gerenciamento de Formularios de agendamento
  async configSchedulePersonsInfo() {
    await this.loadLists();
    this.makeMenuOptionSelectSchedulePersonListItems();
  }

  async loadLists() {
    this.scheduleFormPerson = [];
    this.scheduleFormPersonCompleted = [];
    this.scheduleFormPersonUncompleted = [];
    this.personsEnabled.forEach(person => {
      let adapter = new PersonInsertUpdateAdapter()
      adapter.idPublic = person.id;
      this.schedulePersonService.getAllSchedulePersonByPerson(adapter).subscribe(res => {
        if (res.length > 0) {
          this.scheduleFormPersonCompleted.push({ person: person, schedules: res })
        } else {
          this.scheduleFormPersonUncompleted.push({ person: person, schedules: res })
        }
        this.scheduleFormPerson.push({ person: person, schedules: res });
      }, error => {
        if (error.error != null) {
          this.toastService.showToastError(error.error.title, error.error.message);
        } else {
          this.toastService.showToastError("Registro de agenda de usuário", "Falha ao consultar agenda de usuário: Servidor com problemas");
        }
        console.log(error);
      });
    })

  }

  makeMenuOptionSelectSchedulePersonListItems() {
    this.menuOptionSelectSchedulePersonListItems = [
      { label: "Todos", command: () => this.openListSchedulePerson(this.scheduleFormPerson, "todos") },
      { label: "Preenchidos", command: () => this.openListSchedulePerson(this.scheduleFormPersonCompleted, "preenchidos") },
      { label: "Não preenchidos", command: () => this.openListSchedulePerson(this.scheduleFormPersonUncompleted, "nao_preenchidos") }
    ]
  }

  openListSchedulePerson(list: ScheduleFormPerson[], tipoLista: string) {
    this.scheduleFormPersonToList = [];
    this.typeListScheduleFormPersonSelected = tipoLista;
    list.forEach(item => {
      let status = "";
      if (item.schedules.length > 0) {
        status = "Preenchido"
      } else {
        status = "Não preenchido"
      }
      this.scheduleFormPersonToList.push({ name: item.person.name, username: item.person.user.username, status: status })
    })
    this.showDialogListSchedulePerson = true;
  }

  filterSchedulePersonList(e: any) {
    this.listSchedulePersonFilter = e.target.value
    return this.listSchedulePersonFilter;
  }

  async refreshTableSchedulePerson() {
    this.refreshAll();
    this.toastService.showToastInfo("Informação", "Atualizando tabela isso pode levar alguns segundos")
    if (this.typeListPlatformSelected == "todos") {
      this.openListSchedulePerson(this.scheduleFormPerson, this.typeListPlatformSelected)
    }
    if (this.typeListPlatformSelected == "preenchidos") {
      this.openListSchedulePerson(this.scheduleFormPersonCompleted, this.typeListPlatformSelected)
    }
    if (this.typeListPlatformSelected == "nao_preenchidos") {
      this.openListSchedulePerson(this.scheduleFormPersonUncompleted, this.typeListPlatformSelected)
    }
  }

  openMenuTableSchedulePerson(event: any, menuOptiontSchedulePersonListItems: Menu, schedulePerson: any) {
    console.log(schedulePerson);
    this.menuOptiontSchedulePersonListItems = [];
    let filter = this.scheduleFormPerson.find(f => f.person.name == (schedulePerson.name));

    if (filter != undefined) {
      this.scheduleFormPersonSelected = filter
      this.menuOptiontSchedulePersonListItems.push({ label: "Visualizar", command: () => { this.visualizarSchedulePerson() }, disabled: filter.schedules.length == undefined || filter.schedules.length == 0 })
    }
    menuOptiontSchedulePersonListItems.toggle(event)
  }

  visualizarSchedulePerson() {
    this.loadHorarios();
    this.showDialogSchedulePerson = true
  }

  private loadHorarios() {
    this.isloading = true;
    this.resetHorarios();

    this.scheduleFormPersonSelected.schedules.forEach(item => {
      if (item.weekDay === "domingo") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosDomingo.push(horario)
      }
      if (item.weekDay === "segunda") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosSegunda.push(horario)
      }
      if (item.weekDay === "terca") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosTerca.push(horario)
      }
      if (item.weekDay === "quarta") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosQuarta.push(horario)
      }
      if (item.weekDay === "quinta") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosQuinta.push(horario)
      }
      if (item.weekDay === "sexta") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosSexta.push(horario)
      }
      if (item.weekDay === "sabado") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosSabado.push(horario)
      }
    })
    this.isloading = false;
  }

  private resetHorarios() {
    this.horariosDomingo = [];
    this.horariosSegunda = [];
    this.horariosTerca = [];
    this.horariosQuarta = [];
    this.horariosQuinta = [];
    this.horariosSexta = [];
    this.horariosSabado = [];
  }

  async createSchedule() {
    this.configCalendar()
    this.getPresonsCamDoScehdule();
    this.showDialogCreateSchedulesLive = true;
    this.schedulesOfDayToDelete = []
    this.schedulesOfDayToList = []
  }

  getPresonsCamDoScehdule() {
    this.liveScheduleService.getAllPersonsCamDoLive(new Date()).subscribe(res => {
      this.personsCanDoLive = res;
      if (this.personsCanDoLive.length < 1) {
        this.toastService.showToastWarn("Consulta de usuários", "Não foi encontrado nenhum usuário com permissão para agendar")
      }
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Consulta de Usuários", "Falha ao consultar usuários: Servidor com problemas");
      }
      console.log(error);
    })
  }

  configCalendar() {
    this.minDate = DateUtilsService.getToday()
    this.maxDate = DateUtilsService.plusDays(new Date(), 1)
  }

  selectDateScheduleBtn() {
    if (!this.createScheduleLiveForm.get('dateOfScehdule')?.valid) {
      return;
    }
    let dateSelected_ = this.createScheduleLiveForm.get('dateOfScehdule')?.value ?? undefined;
    if (dateSelected_ == undefined) {
      return;
    }
    console.log(dateSelected_);
    this.dateSelected = DateUtilsService.dateToUnixTime(dateSelected_)
    console.log(this.dateSelected);
    this.isloading = true;
    this.selectedDate = DateUtilsService.DateToStringFormatDate(DateUtilsService.unixTimeToDate(this.dateSelected));
    this.getAllSchedulesOfDaySelected(DateUtilsService.unixTimeToDate(this.dateSelected));
    this.getAllSchedulesOfBeforeDaySelected(DateUtilsService.unixTimeToDate(this.dateSelected));
  }

  getAllSchedulesOfBeforeDaySelected(dateSelected: Date) {
    let dateBefore = DateUtilsService.plusDays(dateSelected, -1);
    this.liveScheduleService.getAllLiveSchedule(dateBefore).subscribe(res => {
      this.isloading = false;
      console.log(res);
      this.schedulesOfBeforeDaySelected = res;
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Consulta de agenda", "Falha ao consultar Agenda: Servidor com problemas");
      }
      console.log(error);
      this.isloading = false
    });
  }

  getAllSchedulesOfDaySelected(dateSelected: Date) {
    this.liveScheduleService.getAllLiveSchedule(dateSelected).subscribe(res => {
      this.isloading = false;
      console.log(res);
      this.schedulesOfDaySelected = res;
      this.createListTable();
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Consulta de agenda", "Falha ao consultar Agenda: Servidor com problemas");
      }
      console.log(error);
      this.isloading = false
    });
  }

  createListTable() {
    this.schedulesOfDayToList = []
    this.listHoursSchedule.forEach(hour => {
      let filter: LiveScheduleAdapter = new LiveScheduleAdapter();
      this.schedulesOfDaySelected.forEach(schedulesOfDay => {
        if (DateUtilsService.unixTimeToDate(schedulesOfDay.startTime).getHours() == Number.parseInt(hour)) {
          filter = schedulesOfDay
        }
      })
      if (filter != undefined && filter.person != undefined && filter.person.user != undefined && filter.person.user.username!=undefined && filter.person.user.username.trim().length > 0) {
        this.schedulesOfDayToList.push({ username: filter.person.user.username, horario: hour })
      }
      else {
        this.schedulesOfDayToList.push({ username: "Vago", horario: hour })
      }
    });
  }

  filterSchedulesOfDayToList(e: any) {
    this.listScheduleOfDayToList = e.target.value
    return this.listScheduleOfDayToList;
  }

  refreshTableUserSchedulesOfDayToList() {
    this.createListTable()
  }

  cancelCreateScheduleBtn() {
    this.createScheduleLiveForm = this._formBuilder.group({
      dateOfScehdule: [new Date(), Validators.required],
      streamerToSchedule: [new PersonCamDoLiveAdapter(), Validators.required]
    });
    this.schedulesOfDayToList = []
    this.schedulesOfDayToDelete = []
    this.selectedDate = "Não selecionado"
    this.dateSelected = 0
    this.showDialogCreateSchedulesLive = false;
  }

  createOrDeleteSchedule(schedule: any, event: any) {
    console.log(schedule);
    console.log(event);


    if (schedule.username == "Vago") {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Deseja Realizar um agendamento no horario: " + schedule.horario + "?",
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.timeSelected = schedule.horario
          this.showDialogRegisterSchedulesLiveForm = true;
        },
        reject: () => { this.toastService.showToastInfo("Confimação", "Operação cancelada") }
      });
    } else {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Deseja remover o  streamer: " + schedule.username + " do horario " + schedule.horario + "?",
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.removeSchedule(schedule);
        },
        reject: () => { this.toastService.showToastInfo("Confimação", "Operação cancelada") }
      })
    }
  }

  removeSchedule(schedule: any) {
    let date_start = DateUtilsService.unixTimeToDate(this.dateSelected)
    let timeSelectedInt = Number.parseInt(schedule.horario);
    let startTime = date_start.setHours(timeSelectedInt, 0, 0, 0)
    let filter = this.schedulesOfDaySelected.findIndex(find => find.startTime == startTime && find.person.user.username);
    if (filter == undefined) {
      this.toastService.showToastWarn("Falha ao remover agendamento", "não foi possivel encontrar streamer");
      return;
    }
    this.schedulesOfDayToDelete.push(this.schedulesOfDaySelected[filter]);
    this.schedulesOfDaySelected.splice(filter, 1);
    this.createListTable()
  }

  saveNewSchedule(event: any) {
    console.log(this.createScheduleLiveForm.get('streamerToSchedule')?.value);
    let personCamDoLive: PersonCamDoLiveAdapter = this.createScheduleLiveForm.get('streamerToSchedule')?.value ?? new PersonCamDoLiveAdapter();
    if (personCamDoLive.person.id == undefined || personCamDoLive.person.id.length < 1) {
      this.toastService.showToastWarn("Falha ao registrar agendamento", "O streamer deve ser selecionado");
      return;
    }

    if (this.schedulesOfBeforeDaySelected.filter(filter => filter.person.id == personCamDoLive.person.id).length > 0
      || this.schedulesOfDaySelected.filter(filter => filter.person.id == personCamDoLive.person.id).length > 0) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "O Streamer " + personCamDoLive.stream.channel + ", já tem uma agendamento entre a data anterior e a data atual selecionada, Deseja agenda-lo mesmo assim?",
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.registerSchedule(personCamDoLive.person)
        },
        reject: () => { this.toastService.showToastInfo("Confimação", "Operação cancelada") }
      })

    } else {
      this.registerSchedule(personCamDoLive.person);
    }
  }

  private registerSchedule(streamer: PersonResponseAdapter) {
    let newSchedule = new LiveScheduleAdapter()
    let timeSelectedInt = Number.parseInt(this.timeSelected);
    let date_start = DateUtilsService.unixTimeToDate(this.dateSelected)
    let date_end = DateUtilsService.unixTimeToDate(this.dateSelected)
    let startTime = date_start.setHours(timeSelectedInt, 0, 0, 0)
    let endTime = date_end.setHours(timeSelectedInt + 1, 0, 0, 0)

    newSchedule.person = streamer;
    newSchedule.endTime = endTime
    newSchedule.startTime = startTime;
    newSchedule.date = startTime;

    this.schedulesOfDaySelected.push(newSchedule);
    this.createListTable()
    this.cancelNewSchedule()
  }

  cancelNewSchedule() {
    this.showDialogRegisterSchedulesLiveForm = false
    this.timeSelected = "";
    this.createScheduleLiveForm.get('streamerToSchedule')?.setValue(new PersonCamDoLiveAdapter());
  }

  confirmNewSchedule(event: any) {
    this.isloading = true;
    if (this.schedulesOfDayToDelete.length > 0) {
      this.liveScheduleService.deleteLiveSchedule(this.schedulesOfDayToDelete).subscribe(res => {
        this.liveScheduleService.registerLiveSchedule(this.schedulesOfDaySelected).subscribe(res => {
          this.toastService.showToastSuccess("Agendamento", "Agendamento realizado com sucesso")
          console.log(res);
          this.createSchedule()
          this.cancelNewSchedule();
          this.cancelCreateScheduleBtn()
          setTimeout(() => {
            this.isloading = false;
            this.showDialogCreateSchedulesLive = false;
          }, 1000);
        }, error => {
          if (error.error != null) {
            this.toastService.showToastError(error.error.title, error.error.message);
          } else {
            this.toastService.showToastError("Registro de agendamento", "Falha ao Agendar: Servidor com problemas");
          }
          this.isloading = false;
          console.log(error);
        })
      }, error => {
        if (error.error != null) {
          this.toastService.showToastError(error.error.title, error.error.message);
        } else {
          this.toastService.showToastError("Registro de agendamento", "Falha ao Agendar: Servidor com problemas");
        }
        this.isloading = false;
        console.log(error);
      })
      return;
    } else {
      this.liveScheduleService.registerLiveSchedule(this.schedulesOfDaySelected).subscribe(res => {
        this.toastService.showToastSuccess("Agendamento", "Agendamento realizado com sucesso")
        console.log(res);
        this.createSchedule()
        this.cancelNewSchedule();
        this.cancelCreateScheduleBtn()
        setTimeout(() => {
          this.isloading = false;
          this.showDialogCreateSchedulesLive = false;
        }, 1000);
      }, error => {
        if (error.error != null) {
          this.toastService.showToastError(error.error.title, error.error.message);
        } else {
          this.toastService.showToastError("Registro de agendamento", "Falha ao Agendar: Servidor com problemas");
        }
        this.isloading = false;
        console.log(error);
      })
    }
  }
}
