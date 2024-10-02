import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';
import { SchedulePersonService } from '../../../services/schedule-person.service';
import { StreamsService } from '../../../services/streams.service';
import { HorariosModel } from '../../../modules/utils/horariosModel';
import { SchedulePersonResponseAdapter } from '../../../modules/schedule-person/adapters/SchedulePersonResponseAdapter';
import { SchedulePersonInsertUpdateAdapter } from '../../../modules/schedule-person/adapters/SchedulePersonInsertUpdateAdapter';
import { ToastService } from '../../../components/toast.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PlataformsAdapter } from '../../../modules/streams/adapters/PlataformsAdapter';
import { StreamsInsertUpdateAdapter } from '../../../modules/streams/adapters/StreamsInsertUpdateAdapter';
import { PersonInsertUpdateAdapter } from '../../../modules/person/adapters/PersonInsertUpdateAdapter';
import { MenuItem } from 'primeng/api';
import { StreamsResponseAdapter } from '../../../modules/streams/adapters/StreamsResponseAdapter';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-my-stream',
  templateUrl: './my-stream.component.html',
  styleUrl: './my-stream.component.scss'
})
export class MyStreamComponent {

  showDialogSchedulePerson = false;
  showDialogStreamPerson = false;
  showDialogRegisterStream = false;
  showDialogListStream = false;
  isloading = false;
  isEdit = false;

  menuOptiontSchedulePersonListItems: MenuItem[] = []

  msgSchedulePerson = ""
  msgStreamPerson = ""
  msgBtnSchedulePerson = "";
  msgBtnStreamPerson = "";
  filteredListStreams = ""

  txtBtnRegisterTransmissao = ""

  schedulePersonResponseAdapter: SchedulePersonResponseAdapter[] = new Array<SchedulePersonResponseAdapter>();
  streamSelected: StreamsResponseAdapter = new StreamsResponseAdapter();

  plataformList: PlataformsAdapter[] = []
  streamsToList: any[] = [];
  horariosDomingo: HorariosModel[] = [];
  horariosSegunda: HorariosModel[] = [];
  horariosTerca: HorariosModel[] = [];
  horariosQuarta: HorariosModel[] = [];
  horariosQuinta: HorariosModel[] = [];
  horariosSexta: HorariosModel[] = [];
  horariosSabado: HorariosModel[] = [];
  Horarios: HorariosModel[] = [];

  allStreams: StreamsResponseAdapter[] = [];

  registerStreamForm = this._formBuilder.group({
    chanel: ['', Validators.required],
    plataform: [new PlataformsAdapter(), Validators.required]
  })

  constructor(
    private _formBuilder: FormBuilder,
    private route: Router,
    private schedulePersonService: SchedulePersonService,
    private streamsService: StreamsService,
    private toastService: ToastService,
  ) {
    if (!GlobalService.personLogged()) {
      this.route.navigate([''])
    }
  }

  ngOnInit(): void {
    this.initiateHorarios();
    this.checkFirstAccesss();
  }

  private initiateHorarios() {
    this.Horarios = [{ horario: "00:00" }, { horario: "01:00" }, { horario: "02:00" }, { horario: "03:00" }, { horario: "04:00" }, { horario: "05:00" }, { horario: "06:00" },
    { horario: "07:00" }, { horario: "08:00" }, { horario: "09:00" }, { horario: "10:00" }, { horario: "11:00" }, { horario: "12:00" },
    { horario: "13:00" }, { horario: "14:00" }, { horario: "15:00" }, { horario: "16:00" }, { horario: "17:00" }, { horario: "18:00" },
    { horario: "19:00" }, { horario: "20:00" }, { horario: "21:00" }, { horario: "22:00" }, { horario: "23:00" },];
  }

  private async checkFirstAccesss() {
    await this.checkSchedulePerson();
    await this.checkStreamPerson();
  }

  private async checkSchedulePerson() {
    this.schedulePersonService.getAllSchedulePersonByPerson().subscribe(res => {
      if (res.length < 1) {
        this.msgSchedulePerson = "Nenhum formulário encontrado preencha seu formulário para usar o sistema."
        this.msgBtnSchedulePerson = "Criar Formulario"
        this.resetHorarios();

      } else {
        this.schedulePersonResponseAdapter = res;
        this.msgSchedulePerson = "Formulario preenchido, caso deseja atualizar é só clicar no botão abaixo."
        this.msgBtnSchedulePerson = "Editar Formulario"
        this.loadHorarios();
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

  private loadHorarios() {
    this.isloading = true;
    console.log(this.schedulePersonResponseAdapter);
    this.resetHorarios();

    this.schedulePersonResponseAdapter.forEach(item => {
      if (item.weekDay.toLowerCase() === "domingo") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosDomingo.push(horario)
      }
      if (item.weekDay.toLowerCase() === "segunda") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosSegunda.push(horario)
      }
      if (item.weekDay.toLowerCase() === "terca") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosTerca.push(horario)
      }
      if (item.weekDay.toLowerCase() === "quarta") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosQuarta.push(horario)
      }
      if (item.weekDay.toLowerCase() === "quinta") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosQuinta.push(horario)
      }
      if (item.weekDay.toLowerCase() === "sexta") {
        let horario = new HorariosModel()
        horario.horario = item.hour
        this.horariosSexta.push(horario)
      }
      if (item.weekDay.toLowerCase() === "sabado") {
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

  private async checkStreamPerson() {
    this.streamsService.getAllStreamsByPerson().subscribe(res => {
      if (res.length < 1) {
        this.msgStreamPerson = "Nenhuma Stream registrada, registre a sua stream para continuar a utilizar o sistema."
        this.msgBtnStreamPerson = "Criar Stream";
      } else {
        this.allStreams = res;
        this.msgStreamPerson = "Stream já registrada, caso deseja atualizar é só clicar no botão abaixo."
        this.msgBtnStreamPerson = "Listar Streams"
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

  criarSchedulePerson() {
    this.showDialogSchedulePerson = true;
  }

  criarStreamPerson() {
    if (this.isEdit) {
      this.txtBtnRegisterTransmissao = "Atualizar"
      this.registerStreamForm = this._formBuilder.group({
        chanel: [this.streamSelected.channel, Validators.required],
        plataform: [this.streamSelected.plataformsAdapter, Validators.required]
      });
      this.showDialogRegisterStream = true;
    } else {
      this.txtBtnRegisterTransmissao = "Cadastrar"
      if (this.msgBtnStreamPerson == "Listar Streams") {
        this.createStreamToList();
        this.showDialogListStream = true;
      } else {
        this.showDialogRegisterStream = true;
      }
    }

    this.streamsService.findAllStreamsPlataforms().subscribe(res => {
      this.plataformList = res;
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Consulta de plataformas", "Falha ao consultar plataformas: Servidor com problemas");
      }
      console.log(error);
    })
    if (this.msgBtnStreamPerson == "Listar Streams") {
      this.createStreamToList();
      this.showDialogListStream = true;
    } else {
      this.showDialogRegisterStream = true;
    }
  }

  createStreamToList() {
    this.streamsToList = []
    this.allStreams.forEach(item => {
      this.streamsToList.push({ channel: item.channel, link: item.plataformsAdapter.urlBase + item.channel })
    })
  }

  saveFormStream() {
    if (this.registerStreamForm.get('chanel')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Informe o nome do seu canal");
      return
    }
    if (this.registerStreamForm.get('plataform')?.valid == false) {
      this.toastService.showToastWarn("Campo inválido", "Selecione uma plataforma");
      return
    }
    let adapter = new StreamsInsertUpdateAdapter()
    let chanel = this.registerStreamForm.get('chanel')?.value
    let platform = this.registerStreamForm.get('plataform')?.value
    let person = new PersonInsertUpdateAdapter()
    person.idPublic = GlobalService.getPerson().id;
    adapter.person = person;
    if (chanel != undefined) {
      adapter.channel = chanel
    }
    if (platform != undefined) {
      adapter.plataform = platform
    }
    if (this.isEdit) {
      adapter.idPublic = this.streamSelected.idPublic;
      this.streamsService.updateStreams(adapter).subscribe(res => {
        this.toastService.showToastSuccess("Atualização de stream", "Stream Atualizada com sucesso!")
        this.refreshTableStreams()
        setTimeout(() => {
          this.cancelRegisterStream();
          this.checkFirstAccesss()
        }, 1000);

      }, error => {
        if (error.error.code != null) {
          this.toastService.showToastError(error.error.title, error.error.message);
        } else {
          this.toastService.showToastError("Atualização de stream", "Falha ao Atualizar sua stream: Servidor com problemas");
        }
        console.log(error);
        this.isloading = false;
      })
    } else {
      this.streamsService.registerStreams(adapter).subscribe(res => {
        this.toastService.showToastSuccess("Registro de stream", "Stream cadastrada com sucesso!")
        setTimeout(() => {
          this.cancelRegisterStream();
          this.checkFirstAccesss()
        }, 1000);

      }, error => {
        if (error.error.code != null) {
          this.toastService.showToastError(error.error.title, error.error.message);
        } else {
          this.toastService.showToastError("Registro de stream", "Falha ao Salvar sua stream: Servidor com problemas");
        }
        console.log(error);
        this.isloading = false;
      })
    }
  }

  saveFormSChedulePerson() {
    this.isloading = true;
    let schedulesPersonInsert = new Array<SchedulePersonInsertUpdateAdapter>();
    this.horariosDomingo.forEach(item => {
      let schedulePersonInsert = new SchedulePersonInsertUpdateAdapter();
      schedulePersonInsert.weekDay = "domingo"
      schedulePersonInsert.person = GlobalService.getPerson();
      schedulePersonInsert.hour = item.horario
      schedulesPersonInsert.push(schedulePersonInsert);
    })
    this.horariosSegunda.forEach(item => {
      let schedulePersonInsert = new SchedulePersonInsertUpdateAdapter();
      schedulePersonInsert.weekDay = "segunda"
      schedulePersonInsert.person = GlobalService.getPerson();
      schedulePersonInsert.hour = item.horario
      schedulesPersonInsert.push(schedulePersonInsert);
    })
    this.horariosTerca.forEach(item => {
      let schedulePersonInsert = new SchedulePersonInsertUpdateAdapter();
      schedulePersonInsert.weekDay = "terca"
      schedulePersonInsert.person = GlobalService.getPerson();
      schedulePersonInsert.hour = item.horario
      schedulesPersonInsert.push(schedulePersonInsert);
    })

    this.horariosQuarta.forEach(item => {
      let schedulePersonInsert = new SchedulePersonInsertUpdateAdapter();
      schedulePersonInsert.weekDay = "quarta"
      schedulePersonInsert.person = GlobalService.getPerson();
      schedulePersonInsert.hour = item.horario
      schedulesPersonInsert.push(schedulePersonInsert);
    })
    this.horariosQuinta.forEach(item => {
      let schedulePersonInsert = new SchedulePersonInsertUpdateAdapter();
      schedulePersonInsert.weekDay = "quinta"
      schedulePersonInsert.person = GlobalService.getPerson();
      schedulePersonInsert.hour = item.horario
      schedulesPersonInsert.push(schedulePersonInsert);
    })
    this.horariosSexta.forEach(item => {
      let schedulePersonInsert = new SchedulePersonInsertUpdateAdapter();
      schedulePersonInsert.weekDay = "sexta"
      schedulePersonInsert.person = GlobalService.getPerson();
      schedulePersonInsert.hour = item.horario
      schedulesPersonInsert.push(schedulePersonInsert);
    })
    this.horariosSabado.forEach(item => {
      let schedulePersonInsert = new SchedulePersonInsertUpdateAdapter();
      schedulePersonInsert.weekDay = "sabado"
      schedulePersonInsert.person = GlobalService.getPerson();
      schedulePersonInsert.hour = item.horario
      schedulesPersonInsert.push(schedulePersonInsert);
    })
    this.schedulePersonService.registerSchedulePerson(schedulesPersonInsert).subscribe(result => {
      console.log(result);
      this.toastService.showToastSuccess("Formulário de Horários", "Seu formulário de Horarios foi Salvo com sucesso")
      this.showDialogSchedulePerson = false;
      this.checkFirstAccesss();
      this.isloading = false;
    }, error => {
      if (error.error.code != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Formulário de Horários", "Falha ao Salvar seu formulário: Servidor com problemas");
      }
      console.log(error);
      this.isloading = false;
    });
  }

  cancelRegisterStream() {
    this.registerStreamForm = this._formBuilder.group({
      chanel: ['', Validators.required],
      plataform: [new PlataformsAdapter(), Validators.required]
    });
    this.showDialogRegisterStream = false;
    if (this.isEdit) {
      this.isEdit = false;
    }
  }

  filterStreamsList(e: any) {
    this.filteredListStreams = e.target.value
    return this.filteredListStreams;
  }

  refreshTableStreams() {
    this.toastService.showToastInfo("Informação", "Atualizando tabela isso pode levar alguns segundos");
    this.allStreams = []
    this.streamsToList = []
    this.streamsService.getAllStreamsByPerson().subscribe(res => {
      this.allStreams = res;
      this.createStreamToList()
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Registro de Stream de usuário", "Falha ao consultar Streans de usuário: Servidor com problemas");
      }
      console.log(error);
    })
  }

  openMenuTableStreams(event: any, menu: Menu, stream: any) {
    this.menuOptiontSchedulePersonListItems = []
    let filter = this.allStreams.find(f => f.channel == stream.channel);
    if (filter != undefined) {
      this.streamSelected = filter;
      this.menuOptiontSchedulePersonListItems.push({ label: "Abrir link", command: () => { window.open(stream.link, '_blank') } })
      this.menuOptiontSchedulePersonListItems.push({ label: "Editar", command: () => { this.openEditStream() } })
      this.menuOptiontSchedulePersonListItems.push({ label: "Deletar", command: () => { this.deleteStream() } })
    }
    menu.toggle(event)
  }

  openEditStream() {
    this.isEdit = true;
    this.criarStreamPerson();
  }

  deleteStream() {
    let adapter = new StreamsInsertUpdateAdapter();
    adapter.idPublic = this.streamSelected.idPublic;
    this.streamsService.deleteStreams(adapter).subscribe(res => {
      this.toastService.showToastSuccess("Exclusão de stream", "Stream deletada com sucesso");
      this.refreshTableStreams();
    });
  }
}
