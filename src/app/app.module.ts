
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AnnulationComponent } from './component/annulation/annulation.component';
import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './component/home/home.component';
@NgModule({
  declarations: [
    AppComponent,
    AnnulationComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: { display: { dateInput: 'DD/MM/YYYY' } } },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' } // Définir la locale pour le format de date
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
