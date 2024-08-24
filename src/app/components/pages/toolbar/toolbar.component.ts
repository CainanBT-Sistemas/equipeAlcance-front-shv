import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { MenuItem } from 'primeng/api';
import { PersonResponseAdapter } from '../../../modules/person/adapters/PersonResponseAdapter';
import { Router } from '@angular/router';
import { SchedulePersonService } from '../../../services/schedule-person.service';
import { StreamsService } from '../../../services/streams.service';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  showDialogSchedulePerson = false;
  showDialogStreamPerson = false;

  menu: MenuItem[] | undefined

  openDashboard = true;
  openMyStreams = false;
  openWhatchStreamers = false;
  openMySchedule = false;
  openMyAccount = false;
  openPonctuaction = false;
  openMyScheduleForm = false;

  openPageAdministrativo = false;

  constructor(
    private schedulePersonService: SchedulePersonService,
    private streamsService: StreamsService,
    private toastService: ToastService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.makeMenu();
    this.checkFirstAccesss()
  }

  private async checkFirstAccesss() {
    await this.checkSchedulePerson();
    await this.checkStreamPerson();
  }
  private async checkSchedulePerson() {
    this.schedulePersonService.getAllSchedulePersonByPerson().subscribe(res => {
      if (res.length < 1) {
        this.showDialogSchedulePerson = true;
      }
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Registro de agenda de usuário", "Falha ao consultar agenda de usuário: Servidor com problemas");
      }
      console.log(error);
    })
  }

  private async checkStreamPerson() {
    this.streamsService.getAllStreamsByPerson().subscribe(res => {
      if (res.length < 1) {
        this.showDialogStreamPerson = true;
      }
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Registro de Stream de usuário", "Falha ao consultar Streans de usuário: Servidor com problemas");
      }
      console.log(error);
    })
  }

  makeMenu() {
    this.menu = [
      {
        title: this.getNameProfile(),
        separator: true
      },
      {
        label: 'Minha conta',
        items: [
          {
            label: 'configuração',
            icon: 'pi pi-cog',
            command: () => this.goToMyAccount()
          },
          {
            label: 'notificações',
            icon: 'pi pi-bell',
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          }
        ]
      }
    ];

    if (GlobalService.personIsADM()) {
      this.menu = [
        {
          title: this.getNameProfile(),
          separator: true
        },
        {
          label: 'Minha conta',
          items: [
            {
              label: 'configuração',
              icon: 'pi pi-cog',
              command: () => this.goToMyAccount()
            },
            {
              label: 'notificações',
              icon: 'pi pi-bell',
            },
            {
              label: 'Logout',
              icon: 'pi pi-sign-out',
              command: () => this.logout()
            }
          ],
          separator:true
        },
        {
          label: 'Sistema',
          items: [
            {
              label: 'Administração',
              icon: 'pi pi-shield',
              command: () => this.goToPageAdministrativo()
            }
          ]
        }
      ];
    }
  }

  goToDashboard() {
    this.openDashboard = true;
    this.openMyStreams = false;
    this.openWhatchStreamers = false;
    this.openMySchedule = false;
    this.openMyAccount = false;
    this.openPonctuaction = false;
    this.openMyScheduleForm = false;
    this.openPageAdministrativo = false; 
    this.checkFirstAccesss()
  }

  goToMyStreams() {
    this.openDashboard = false;
    this.openMyStreams = true;
    this.openWhatchStreamers = false;
    this.openMySchedule = false;
    this.openMyAccount = false;
    this.openPonctuaction = false;
    this.openMyScheduleForm = false;
    this.openPageAdministrativo = false;

    if (this.showDialogSchedulePerson == true) {
      this.showDialogSchedulePerson = false;
    }
    if (this.showDialogStreamPerson == true) {
      this.showDialogStreamPerson = false;
    }
  }

  goToWhatchStreamers() {
    this.openDashboard = false;
    this.openMyStreams = false;
    this.openWhatchStreamers = true;
    this.openMySchedule = false;
    this.openMyAccount = false;
    this.openPonctuaction = false;
    this.openMyScheduleForm = false;
    this.openPageAdministrativo = false;
    this.checkFirstAccesss()
  }

  goToMySchedule() {
    this.openDashboard = false;
    this.openMyStreams = false;
    this.openWhatchStreamers = false;
    this.openMySchedule = true;
    this.openMyAccount = false;
    this.openPonctuaction = false;
    this.openMyScheduleForm = false;
    this.openPageAdministrativo = false;
    this.checkFirstAccesss()
  }

  goToMyAccount() {
    this.openDashboard = false;
    this.openMyStreams = false;
    this.openWhatchStreamers = false;
    this.openMySchedule = false;
    this.openMyAccount = true;
    this.openPonctuaction = false;
    this.openMyScheduleForm = false;
    this.openPageAdministrativo = false;
    this.checkFirstAccesss()
  }

  goToMyPonctuaction() {
    this.openDashboard = false;
    this.openMyStreams = false;
    this.openWhatchStreamers = false;
    this.openMySchedule = false;
    this.openMyAccount = false;
    this.openPonctuaction = true;
    this.openMyScheduleForm = false;
    this.openPageAdministrativo = false;
    this.checkFirstAccesss()
  }

  goToMyScheduleForm() {
    this.openDashboard = false;
    this.openMyStreams = false;
    this.openWhatchStreamers = false;
    this.openMySchedule = false;
    this.openMyAccount = false;
    this.openPonctuaction = false;
    this.openMyScheduleForm = true;
    this.openPageAdministrativo = false;
    this.checkFirstAccesss()
  }

  goToPageAdministrativo() {
    if (GlobalService.personIsADM()) {
      this.openDashboard = false;
      this.openMyStreams = false;
      this.openWhatchStreamers = false;
      this.openMySchedule = false;
      this.openMyAccount = false;
      this.openPonctuaction = false;
      this.openMyScheduleForm = false;
      this.openPageAdministrativo = true;
    }
  }

  userChecked() {
    return false
  }

  getImageProfile() {
    return '../../../../../assets/imgs/user-unknown-withe.png'
  }

  getNameProfile() {
    return GlobalService.getPerson().user.username
  }

  getTypeUser() {
    return GlobalService.getPerson().user.role.roleName
  }

  logout() {
    GlobalService.setPerson(new PersonResponseAdapter());
    this.route.navigate(['']);
  }
}
