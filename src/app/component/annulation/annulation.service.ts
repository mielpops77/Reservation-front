import { Reservation } from '../../models/reservation.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnulationService {

  private apiUrl = 'http://localhost:3000/reservations'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer une réservation par son ID
  getReservationById(reservationId: string | null = null): Observable<Reservation> {
    const url = `${this.apiUrl}/${reservationId}`;
    return this.http.get<Reservation>(url);
  }

  annulerReservationById(reservationId: string | null = null): Observable<any> {
    const url = `${this.apiUrl}/${reservationId}`;
    return this.http.delete<Reservation>(url);
  }
}
