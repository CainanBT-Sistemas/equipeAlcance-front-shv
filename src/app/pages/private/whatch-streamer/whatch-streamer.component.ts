import { UpdatesLurksApiService } from './../../../services/requests/updates-lurks-api.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';
import { UpdatesLurksAdapter } from '../../../modules/UpdatesLurks/adapters/UpdatesLurksAdapter';
import { ToastService } from '../../../components/toast.service';

@Component({
  selector: 'app-whatch-streamer',
  templateUrl: './whatch-streamer.component.html',
  styleUrl: './whatch-streamer.component.scss'
})
export class WhatchStreamerComponent {


  lurkDesktop: UpdatesLurksAdapter = new UpdatesLurksAdapter();
  lurkMobile: UpdatesLurksAdapter = new UpdatesLurksAdapter();

  constructor(
    private route: Router,
    private updatesLurksApiService: UpdatesLurksApiService,
    private toastService: ToastService,
  ) {
    if (!GlobalService.personLogged()) {
      this.route.navigate([''])
    }
  }

  ngOnInit(): void {
    this.getLurks();
  }

  getLurks() {
    this.updatesLurksApiService.getAllUpdatesLurks().subscribe(res=>{
      res.forEach(item=>{
        if(item.name.includes('Lurk Equipe Alcance Mobile')){
          this.lurkMobile = item
        }
        if(item.name.includes('Lurk Equipe Alcance Desktop')){
          this.lurkDesktop = item
        }
      })
    }, error => {
      if (error.error != null) {
        this.toastService.showToastError(error.error.title, error.error.message);
      } else {
        this.toastService.showToastError("Consulta de Lurks", "Falha ao consultar Lurks: Servidor com problemas");
      }
      console.log(error);
    })
  }
}
