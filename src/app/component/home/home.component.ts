import { MatCalendarCellCssClasses, MatCalendar } from '@angular/material/datepicker';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

interface ScheduleTime {
  time: string;
  isPast: boolean;
  reservationNbr: Number;

}
interface ScheduleOption {
  label: string;
  times: ScheduleTime[];
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;

  guestNumbers: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  selectedOption: string | null = null;
  scheduleOptions: ScheduleOption[] = [];
  currentDate: Date = new Date();
  nonClickableDates: Date[] = [];
  selected: Date | null = null;
  limiteInvitations: number = 0;
  isGuestNumberDisabled = false;
  stepOne: Boolean = true;
  initGestNumber = false;
  formattedDate = '';
  hourSelected = '';
  form!: FormGroup;


  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.selected = null;
  }

  ngOnInit(): void {
    this.initForm();
    this.getReservationsConfig();
    ;
  }

  initForm(): void {
    this.form = this.fb.group({
      choice: ['all'],
      guestNumber: ['all'],
      selectedDate: [''],
      mobile: [''],
      email: ['', [Validators.email]],
      message: [''],
      firstName: [''],
      lastName: ['']
    });
  }


  getReservations(): void {
    this.http.get<any>('http://localhost:3000/reservations').subscribe(
      (reservations) => {
        this.getScheduleOptions();
        // console.log('Réservations récupérées :', reservations);
      },
      (error) => {
        // console.error('Erreur lors de la requête :', error);
      }
    );
  }


  getReservationsConfig(): void {
    this.http.get<any>('http://localhost:3000/reservationsconfig').subscribe(
      (reservationsConfig) => {
        this.limiteInvitations = reservationsConfig.numberPlacesHour;
        this.getReservations();
      },
      (error) => {
        console.error('Erreur lors de la requête :', error);
      }
    );
  }



  getScheduleOptions(): void {
    this.http.get<any>('http://localhost:3000/reservationsconfig/scheduleoptions').subscribe(
      (response) => {
        const scheduleOptions = response.scheduleOptions;
        this.scheduleOptions = scheduleOptions;
        console.log( this.scheduleOptions);
      },
      (error) => {
        // console.error('Erreur lors de la requête :', error);
      }
    );
  }


  updateScheduleReservations(selectedDate: string): void {
    this.scheduleOptions.forEach((option) => {
      option.times.forEach((scheduleTime) => {
        scheduleTime.reservationNbr = 0;
      });
    });

    this.http.get<any>('http://localhost:3000/reservations').subscribe(
      (reservations) => {
        const matchingReservations = reservations.filter((reservation: any) => reservation.date === selectedDate);

        matchingReservations.forEach((reservation: any) => {
          const reservationHourParts = reservation.hour.split(':');
          const reservationHour = parseInt(reservationHourParts[0], 10);

          // Trouvez l'index de l'horaire dans scheduleOptions
          const scheduleOptionIndex = this.scheduleOptions.findIndex((option) =>
            option.times.some((time) => time.time === reservation.hour)
          );

          if (scheduleOptionIndex !== -1) {
            // Mettez à jour la réservation pour l'horaire correspondant et les trois suivants
            for (let i = scheduleOptionIndex; i < this.scheduleOptions.length; i++) {
              const scheduleTimeIndex = this.scheduleOptions[i].times.findIndex(
                (time) => time.time === reservation.hour
              );

              if (scheduleTimeIndex !== -1) {
                this.scheduleOptions[i].times[scheduleTimeIndex].reservationNbr += reservation.nombrePersonnes;
                // Mettez à jour la réservation pour les trois heures suivantes
                for (let j = scheduleTimeIndex + 1; j < scheduleTimeIndex + 4 && j < this.scheduleOptions[i].times.length; j++) {
                  this.scheduleOptions[i].times[j].reservationNbr += reservation.nombrePersonnes;
                }
                break; // Sortez de la boucle une fois que nous avons mis à jour les réservations pour l'horaire correspondant et les trois suivants
              }
            }
          }
        });
        this.updateIsPastBasedOnReservationNbr();
      },

      (error) => {
        console.error('Erreur lors de la requête :', error);
      }
    );


  }
  updateIsPastBasedOnReservationNbr(): void {
    for (const option of this.scheduleOptions) {
      for (let i = 0; i < option.times.length; i++) {
        const reservationNbr = Number(option.times[i].reservationNbr);
        if (reservationNbr > this.limiteInvitations - this.form.get('guestNumber')?.value) {
          option.times[i].isPast = true;
        } else if (!option.times[i].isPast) {
          option.times[i].isPast = false;
        }
      }
    }
  }


  onSelectionServiceChange(event: any) {
    console.log('test');
    this.selectedOption = event.value;
    this.hourSelected = '';
    this.selected = null;
    if (this.form.get('guestNumber')?.value !== 'all')
    {
    this.getNonClickableDates(this.limiteInvitations - this.form.get('guestNumber')?.value, event.value, this.scheduleOptions).subscribe(
      (dates: Date[]) => {
        this.nonClickableDates = dates
        this.calendar.updateTodaysDate();
      },
      (error) => {
        console.error('Error fetching non-clickable dates:', error);
      }
    );
  }

  }

  onSelectionInvitationChange(event: any) {
    console.log("heeeddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddy");

    this.hourSelected = '';
    this.selected = null;
    this.isGuestNumberDisabled = true;

    if (event.value !== 'all')
    {
    this.getNonClickableDates(this.limiteInvitations - event.value, this.form.get('choice')?.value, this.scheduleOptions).subscribe(
      (dates: Date[]) => {
        this.nonClickableDates = dates
        this.calendar.updateTodaysDate();
      },
      (error) => {
        console.error('Error fetching non-clickable dates:', error);
      }
    );
  }

  }

  hourChange(hour: string) {
    this.hourSelected = hour;
  }

  dateSelected(event: any) {
    // console.log('Date selected:', event);
    // Le reste du code...

    this.hourSelected = '';
    const inputDate = new Date(event.toString());
    if (inputDate) {
      const day: number = inputDate.getDate();
      const month: number = inputDate.getMonth() + 1;
      const year: number = inputDate.getFullYear();
      this.formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
      this.updateScheduleReservations(this.formattedDate);

      // Get the current date
      const today = new Date();
      const todayDay: number = today.getDate();
      const todayMonth: number = today.getMonth() + 1;
      const todayYear: number = today.getFullYear();
      const todayHours: number = today.getHours();
      const todayMinutes: number = today.getMinutes();

      for (const option of this.scheduleOptions) {
        option.times.forEach((scheduleTime) => {
          const timeParts = scheduleTime.time.split(':');
          const hour = parseInt(timeParts[0], 10);
          const minute = parseInt(timeParts[1], 10);

          scheduleTime.isPast =
            (day === todayDay && month === todayMonth && year === todayYear) &&
            (hour < todayHours || (hour === todayHours && minute <= todayMinutes));
        });
      }
    }
  }

  getNonClickableDates(limiteInvitations: number, label: string, scheduleOptions: ScheduleOption[]): Observable<any> {

    switch (label) {
      case 'all':
        label = 'all';
        break;
      case 'breakfast':
        label = 'Déjeuner';
        break;
      case 'afternoon':
        label = 'Après-midi';
        break;
      case 'dinner':
        label = 'Dîner';
        break;
      default:
        break;
    }

    const params = new HttpParams()
      .set('limiteInvitations', limiteInvitations.toString())
      .set('label', label)
      .set('scheduleOptions', JSON.stringify(scheduleOptions));

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: params
    };

    return this.http.get<any>('http://localhost:3000/reservations/nonclickabledates', httpOptions);
  }



  submitForm(): void {
    if (this.form.valid) {
      this.createReservation();
    }
  }


  createReservation() {
    const requestBody = {
      date: this.formattedDate,
      nombrePersonnes: this.form.get('guestNumber')?.value,
      hour: this.hourSelected,
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      mobile: this.form.get('mobile')?.value.toString(),
      email: this.form.get('email')?.value,
      message: this.form.get('message')?.value
    };

    this.http.post<any>('http://localhost:3000/reservations', requestBody).subscribe(
      (response) => {
        // console.log('Réponse de l\'API :', response);
      },
      (error) => {
        // console.error('Erreur lors de la requête :', error);
      }
    );
  }

  stepConfig(step: Boolean) {
    this.stepOne = step;
  }


  dateClassCallback = (date: any,): MatCalendarCellCssClasses => {
    // const cssClasses: MatCalendarCellCssClasses = {};
    console.log('nonClickableDates', this.nonClickableDates);
    if (this.nonClickableDates.some(d => this.isSameDate(date, d))) {
      return 'example-custom-date-class';
    }
    return '';
  };



  isSameDate(date1: Date, date2: any): boolean {
    // Convertir date2 en objet Date s'il s'agit d'une chaîne de caractères
    if (typeof date2 === 'string') {
      date2 = new Date(date2);
    }

    if (date2 > date1) {
      return false;
    }
    const isSame = (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );

    // console.log(isSame);
    return isSame;
  }

}

