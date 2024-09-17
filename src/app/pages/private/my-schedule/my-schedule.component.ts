import { LiveScheduleService } from './../../../services/live-schedule.service';
import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { Router } from '@angular/router';
import { LiveScheduleAdapter } from '../../../modules/live-schedule/LiveScheduleAdapter';
import { DateUtilsService } from '../../../services/date-utils.service';
import { ToastService } from '../../../components/toast.service';
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable, { RowInput, Table } from 'jspdf-autotable';

@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.scss'
})
export class MyScheduleComponent {

  isloading = false

  nextSchedules: LiveScheduleAdapter[] = []
  nextSchedulesToList: any[] = []
  filterTxtDtNextSchedule = ""

  previousSchedules: LiveScheduleAdapter[] = []
  previousSchedulesToList: any[] = []
  filterTxtDtPreviousSchedule = ""

  guysSchedyles: LiveScheduleAdapter[] = []
  guysSchedulesToList: any[] = []
  filterTxtDtGuysSchedule = ""
  GuysScheduleDateSelected: Date = new Date()
  exportColumns: any[] = [];


  cols!: any[];

  listHoursSchedule: string[] = [
    "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
    "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
  ]

  constructor(
    private route: Router,
    private liveScheduleService: LiveScheduleService,
    private toastService: ToastService,
  ) {
    if (!GlobalService.personLogged()) {
      this.route.navigate([''])
    }
  }

  ngOnInit(): void {
    this.initiatePage();
  }

  initiatePage() {

    this.cols = [
      { field: 'date', header: 'Data', customExportHeader: 'Data & Hora' },
      { field: 'username', header: 'Username' },
    ]

    this.getPreviousSchedules();
    this.getNextSchedules()
  }

  getPreviousSchedules() {
    this.previousSchedules = [];
    let start = DateUtilsService.dateToUnixTime(new Date(0));
    let end = DateUtilsService.dateToUnixTime(DateUtilsService.getToday());
    this.liveScheduleService.getAllLiveSchedulePeriodPerson(start, end, GlobalService.getPerson()).subscribe(res => {
      this.previousSchedules = res;
      this.createTableDtPreviousSchedule()
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Carregamendo de usuários", "Falha ao consultar usuários: Servidor com problemas");
      }
      console.log(error);
    })
  }

  getNextSchedules() {
    this.nextSchedules = [];
    let start = DateUtilsService.dateToUnixTime(new Date());
    let end = DateUtilsService.dateToUnixTime(DateUtilsService.setHours(DateUtilsService.plusDays(DateUtilsService.getToday(), 7), 23))
    this.liveScheduleService.getAllLiveSchedulePeriodPerson(start, end, GlobalService.getPerson()).subscribe(res => {
      this.nextSchedules = res;
      this.createTableDtNextSchedule()
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Carregamendo de usuários", "Falha ao consultar usuários: Servidor com problemas");
      }
      console.log(error);
    })
  }

  getGuysSchedyles(dateSelected: Date) {
    this.liveScheduleService.getAllLiveSchedule(dateSelected).subscribe(res => {
      this.isloading = false;
      console.log(res);
      this.guysSchedyles = res;
      this.createTableDtGuysSchedule();
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


  filterDtGuysSchedule(e: any) {
    this.filterTxtDtGuysSchedule = e.target.value
    return this.filterTxtDtGuysSchedule;
  }

  filterDtNextSchedule(e: any) {
    this.filterTxtDtNextSchedule = e.target.value
    return this.filterTxtDtNextSchedule;
  }

  filterDtPreviousSchedule(e: any) {
    this.filterTxtDtPreviousSchedule = e.target.value
    return this.filterTxtDtPreviousSchedule;
  }

  refreshDtGuysSchedule() {
    this.getGuysSchedyles(this.GuysScheduleDateSelected);
  }

  refreshDtNextSchedule() {
    this.getNextSchedules()
  }

  refreshDtPreviousSchedule() {
    this.getPreviousSchedules()
  }

  createTableDtGuysSchedule() {
    this.guysSchedulesToList = [];
    this.exportColumns = []
    this.listHoursSchedule.forEach(hour => {
      let filter: LiveScheduleAdapter = this.guysSchedyles.filter(filter => DateUtilsService.unixTimeToDate(filter.startTime).getHours() == Number.parseInt(hour))[0];
      if (filter != null) {
        let dateToShow = DateUtilsService.DateToStringFormatDate(new Date(filter.startTime)).concat(" - " + DateUtilsService.DateToStringFormatTime(new Date(filter.startTime)))
        this.guysSchedulesToList.push({ username: filter.person.user.username, horario: dateToShow })
      } else {
        let dateToShow = DateUtilsService.DateToStringFormatDate(this.GuysScheduleDateSelected).concat(" - " + DateUtilsService.DateToStringFormatTime(new Date(DateUtilsService.setHours(this.GuysScheduleDateSelected, Number.parseInt(hour)))))
        this.guysSchedulesToList.push({ username: "Vago", horario: dateToShow })

      }
    });
    this.exportColumns = this.cols.map(col => ({
      Title: col.header,
      datakey: col.field
    }))
  }

  createTableDtNextSchedule() {
    this.nextSchedulesToList = [];
    this.nextSchedules.forEach(item => {
      let dateToShow = DateUtilsService.DateToStringFormatDate(new Date(item.startTime)).concat(" - " + DateUtilsService.DateToStringFormatTime(new Date(item.startTime)))
      this.nextSchedulesToList.push({ date: dateToShow, username: item.person.user.username })
    })
  }

  createTableDtPreviousSchedule() {
    this.previousSchedulesToList = [];
    this.previousSchedules.forEach(item => {
      let dateToShow = DateUtilsService.DateToStringFormatDate(new Date(item.startTime)).concat(" - " + DateUtilsService.DateToStringFormatTime(new Date(item.startTime)))
      this.previousSchedulesToList.push({ date: dateToShow, username: item.person.user.username })
    })
  }

  selectDateGuysSchedule() {
    if (this.GuysScheduleDateSelected != undefined) {
      this.isloading = true;
      this.getGuysSchedyles(this.GuysScheduleDateSelected)
    }
  }

  exportPDF() {
    let doc = new jsPDF('l', 'pt', 'a4');
    const head = [['horario', 'username']]
    let data: any[] = []
    this.guysSchedulesToList.forEach(item => {
      let subData: any[] = [];
      subData.push(item.horario, item.username)
      data.push(subData)
    })
    console.log(this.guysSchedulesToList);
    console.log(data);

    autoTable(doc, {
      head: head,
      body: data,
      didDrawCell: (data) => { }
    })
    console.log(head);
    doc.save("Agendamentos - ".concat(DateUtilsService.DateToStringFormatDate(this.GuysScheduleDateSelected)).concat(".pdf"))
  }
}
