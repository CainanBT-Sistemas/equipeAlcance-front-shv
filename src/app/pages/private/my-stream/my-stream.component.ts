import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';
import { SchedulePersonService } from '../../../services/schedule-person.service';
import { StreamsService } from '../../../services/streams.service';
import { HorariosModel } from '../../../modules/utils/horariosModel';
import { SchedulePersonResponseAdapter } from '../../../modules/schedule-person/adapters/SchedulePersonResponseAdapter';
import { SchedulePersonInsertUpdateAdapter } from '../../../modules/schedule-person/adapters/SchedulePersonInsertUpdateAdapter';
import { ToastService } from '../../../components/toast.service';

@Component({
  selector: 'app-my-stream',
  templateUrl: './my-stream.component.html',
  styleUrl: './my-stream.component.scss'
})
export class MyStreamComponent {

  showDialogSchedulePerson = false;
  showDialogStreamPerson = false;
  msgSchedulePerson = ""
  msgStreamPerson = ""
  msgBtnSchedulePerson = "";
  msgBtnStreamPerson = "";
  isloading = false;

  schedulePersonResponseAdapter: SchedulePersonResponseAdapter[] = new Array<SchedulePersonResponseAdapter>();

  horariosDomingo: HorariosModel[] = [];
  horariosSegunda: HorariosModel[] = [];
  horariosTerca: HorariosModel[] = [];
  horariosQuarta: HorariosModel[] = [];
  horariosQuinta: HorariosModel[] = [];
  horariosSexta: HorariosModel[] = [];
  horariosSabado: HorariosModel[] = [];
  Horarios: HorariosModel[] = [];

  constructor(
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

  private async checkStreamPerson() {
    this.streamsService.getAllStreamsByPerson().subscribe(res => {
      if (res.length < 1) {
        this.msgStreamPerson = "Nenhuma Stream registrada, registre a sua stream para continuar a utilizar o sistema."
        this.msgBtnStreamPerson = "Criar Stream";
      } else {
        this.msgStreamPerson = "Stream já registrada, caso deseja atualizar é só clicar no botão abaixo."
        this.msgBtnStreamPerson = "Editar Stream"
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

  }

  saveFormStream() {

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
      this.toastService.showToastSuccess("Formulário de Horários","Seu formulário de Horarios foi Salvo com sucesso")
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

}
