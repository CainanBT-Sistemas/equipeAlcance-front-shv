import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService){}

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
}
