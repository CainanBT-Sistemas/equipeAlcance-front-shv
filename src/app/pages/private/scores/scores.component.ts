import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../components/toast.service';
import { ScoresService } from '../../../services/scores.service';
import { ScoresRequestAdapter } from '../../../modules/scores/adapters/ScoresRequestAdapter';
import { DateUtilsService } from '../../../services/date-utils.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.scss'
})
export class ScoresComponent {

  isloading = false

  GuysScoresDateSelect = DateUtilsService.getToday();

  scoresGuysToList: any[] = []

  filterTxtDtGuysScores = ""

  cols!: any[];

  constructor(
    private route: Router,
    private toastService: ToastService,
    private scoresService: ScoresService,
  ) {
    if (!GlobalService.personLogged()) {
      this.route.navigate([''])
    }
  }

  ngOnInit(): void {
    this.initiatePage()
  }

  initiatePage() {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'stream', header: 'Streamer' },
      { field: 'score', header: 'Pontuação' }
    ]
  }

  async getAlllScores() {
    this.scoresGuysToList = []
    let request = new ScoresRequestAdapter();
    request.date = DateUtilsService.dateToUnixTime(this.GuysScoresDateSelect);
    this.scoresService.getScoreWithPersonOrNot(request).subscribe(res => {
      if (res != null && res.length > 0) {
        res.forEach(item => {
          this.scoresGuysToList.push({ name: item.person.name, stream: item.streams.channel, score: item.score })
        })
      }
      this.isloading = false;
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Consulta de Pontuação", "Falha ao consultar Pontuação: Servidor com problemas");
      }
      this.isloading = false;
      console.log(error);
    })
  }

  selectDateGuysScore() {
    this.isloading = true
    this.scoresGuysToList = []
    this.getAlllScores();
  }

  filterDtGuysScore(e: any) {
    this.filterTxtDtGuysScores = e.target.value
    return this.filterTxtDtGuysScores;
  }

  refreshDtGuysScore() {
    this.getAlllScores();
  }

  exportPDF() {
    let doc = new jsPDF('l', 'pt', 'a4');
    const head = [['Nome', 'Streamer', 'Pontuação']]
    let data: any[] = []
    this.scoresGuysToList.forEach(item => {
      let subData: any[] = [];
      subData.push(item.name, item.streams, item.score)
      data.push(subData)
    })

    autoTable(doc, {
      head: head,
      body: data,
      didDrawCell: (data) => { }
    })
    doc.save("Pontuacao - ".concat(DateUtilsService.DateToStringFormatDate(this.GuysScoresDateSelect)).concat(".pdf"))
  }
}
