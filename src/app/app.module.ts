
//MODULES
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { StepperModule } from 'primeng/stepper';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';


//COMPONENTS
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/public/login-page/login-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    RippleModule,
    StepperModule,
    ImageModule,
    TooltipModule,
    PasswordModule,
    CalendarModule,
    CardModule,
    ReactiveFormsModule, 
    FormsModule,
    HttpClientModule,
    SidebarModule,
    ToolbarModule,
    AvatarModule,
    OverlayPanelModule,
    MenuModule,
    TabViewModule,
    AccordionModule,
    
  ],exports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    RippleModule,
    StepperModule,
    ImageModule,
    TooltipModule,
    PasswordModule,
    CalendarModule,
    CardModule,
    ReactiveFormsModule, 
    FormsModule,
    HttpClientModule,
    SidebarModule,
    ToolbarModule,
    AvatarGroupModule,
    OverlayPanelModule,
    MenuModule,
    TabViewModule,
    AccordionModule,
  ],
  providers: [
    MessageService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
