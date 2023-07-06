import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        ...MAT_DATE_FORMATS,
        parse: {
          dateInput: 'LL',
        },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
})


export class AppComponent implements OnInit {
  form!: FormGroup;
  guestCounts: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  isUnderlineVisible = true; // ou false selon tes besoins
  open = false;
  isPickerOpen = false;

  @ViewChild('picker') picker!: MatDatepicker<Date>;
  constructor(/* private fb: FormBuilder, */ private http: HttpClient) { }

  ngOnInit(): void {
   /*  this.form = this.fb.group({
      choice: ['all'],
      guestNumber: ['all'],
      selectedDate: [''],
    }); */
    this.form.get('selectedDate')?.valueChanges.subscribe((value) => {
      this.isPickerOpen = true;
      console.log('Date sélectionnée :', value, this.isPickerOpen);

     
    });


  }

  submitForm(): void {
    this.makeGetRequest();

    if (this.form.valid) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const selectedDate = new Date(this.form.value.selectedDate);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate >= currentDate) {
        console.log(this.form.value);
      } else {
        console.log('Veuillez sélectionner une date ultérieure.');
      }
    }
  }
  onSelectOpen(opened: boolean): void {
    if (opened) {
      this.open = true;
    }


    if (!opened && this.form.get('guestNumber')?.value !== 'all') {
      setTimeout(() => {
        this.picker.open();
        this.isPickerOpen = true;
      }, 0);
    }
    else {
      this.isPickerOpen = false;
    }
  }


  dateFilter = (date: Date | null): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return date! >= currentDate;
  };


  makeGetRequest() {
    const url = 'http://localhost:3000/api/v1/ping';

    this.http.get(url).subscribe(
      (response) => {
        console.log(response);
        // Traitez la réponse ici selon vos besoins
      },
      (error) => {
        console.error(error);
        // Gérez les erreurs ici
      }
    );
  }

}
