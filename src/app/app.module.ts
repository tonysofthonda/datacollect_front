import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PrimeNgModule } from './prime-ng.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main.component';
import { ConfigComponent } from './config.component';
import { TemplateModule } from './template/template.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptorService } from '@services/interceptors/error-interceptor/error-interceptor.service';
import { MessageService } from 'primeng/api';
import { TokenInterceptorService } from '@services/interceptors/token-interceptor/token-interceptor.service';
import mxLocale from '@angular/common/locales/es-MX'
import {registerLocaleData} from '@angular/common/';
import { SamlComponent } from './saml/saml.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

registerLocaleData(mxLocale);

@NgModule({
  declarations: [AppComponent, MainComponent, ConfigComponent, SamlComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    TemplateModule,
    PrimeNgModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
   
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
