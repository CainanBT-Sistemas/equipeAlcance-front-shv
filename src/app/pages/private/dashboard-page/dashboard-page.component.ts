import { StreamsService } from './../../../services/streams.service';
import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { SchedulePersonService } from '../../../services/schedule-person.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {

  isloading = false;

  constructor(
    private schedulePersonService: SchedulePersonService,
    private streamsService: StreamsService,
    private messageService: MessageService,
    private route: Router,
  ){
    if(!GlobalService.personLogged()){
      this.route.navigate([''])
    }
  }

  public showToastSuccess( summary: string, detail: string) {
    this.messageService.add({ severity: "success", summary: summary, detail: detail })
  }
  public showToastInfo( summary: string, detail: string) {
    this.messageService.add({ severity: "info", summary: summary, detail: detail })
  }
  public showToastWarn( summary: string, detail: string) {
    this.messageService.add({ severity: "warn", summary: summary, detail: detail })
  }
  public showToastError( summary: string, detail: string) {
    this.messageService.add({ severity: "error", summary: summary, detail: detail })
  }

  ngOnInit(): void {
    
  }

  getNameProfile() {
    return GlobalService.getPerson().user.username
  }

  getHeaderWellcome(){
    return "Olá "+ this.getNameProfile()
  }
}
