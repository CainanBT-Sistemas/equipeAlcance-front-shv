
//MODULES
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { BadgeModule } from 'primeng/badge';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ConfirmPopupModule } from 'primeng/confirmpopup';



//COMPONENTS
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/public/login-page/login-page.component';
import { RegisterPageComponent } from './pages/public/register-page/register-page.component';
import { ToolbarComponent } from './components/pages/toolbar/toolbar.component';
import { DashboardPageComponent } from './pages/private/dashboard-page/dashboard-page.component';
import { MyStreamComponent } from './pages/private/my-stream/my-stream.component';
import { WhatchStreamerComponent } from './pages/private/whatch-streamer/whatch-streamer.component';
import { MyScheduleComponent } from './pages/private/my-schedule/my-schedule.component';
import { MyAccountComponent } from './pages/private/my-account/my-account.component';
import { AdministrativoPageComponent } from './pages/private/admin/administrativo-page/administrativo-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ToolbarComponent,
    DashboardPageComponent,
    MyStreamComponent,
    WhatchStreamerComponent,
    MyScheduleComponent,
    MyAccountComponent,
    AdministrativoPageComponent
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
    BadgeModule,
    DataViewModule,
    DialogModule,
    MultiSelectModule,
    TagModule,
    SkeletonModule,
    TableModule,
    ConfirmPopupModule,
    
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
    BadgeModule,
    DataViewModule,
    DialogModule,
    MultiSelectModule,
    TagModule,
    SkeletonModule,
    TableModule,
    ConfirmPopupModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
