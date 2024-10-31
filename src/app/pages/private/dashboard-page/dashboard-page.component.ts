import { DateUtilsService } from './../../../services/date-utils.service';
import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ScoresService } from '../../../services/scores.service';
import { ScoresRequestAdapter } from '../../../modules/scores/adapters/ScoresRequestAdapter';
import { PersonInsertUpdateAdapter } from '../../../modules/person/adapters/PersonInsertUpdateAdapter';
import { ToastService } from '../../../components/toast.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {

  isloading = false;
  today = DateUtilsService.DateToStringFormatDate(DateUtilsService.getToday())
  potuacaoNow = 0;

  constructor(
    private scoresService: ScoresService,
    private messageService: MessageService,
    private route: Router,
    private toastService: ToastService,
  ){
    if(!GlobalService.personLogged()){
      this.route.navigate([''])
    }
  }

  ngOnInit(): void {
    this.getPontuacaoNow()
  }

  getNameProfile() {
    return GlobalService.getPerson().user.username
  }

  getHeaderWellcome(){
    return "Olá "+ this.getNameProfile()
  }

  getPontuacaoNow(){
    let request = new ScoresRequestAdapter();
    request.date = DateUtilsService.dateToUnixTime(DateUtilsService.getToday());
    request.person = PersonInsertUpdateAdapter.toAdapter(GlobalService.getPerson());
    this.scoresService.getScoreWithPersonOrNot(request).subscribe(res=>{
      if(res != null && res.length > 0){
        this.potuacaoNow = res[0].score
      }
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Consulta de Pontuação", "Falha ao consultar Pontuação: Servidor com problemas");
      }
      console.log(error);
    })
  }
}

