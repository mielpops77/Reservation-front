import { Reservation } from '../../models/reservation.model';
import { AnnulationService } from './annulation.service';
import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-annulation',
  templateUrl: './annulation.component.html',
  styleUrls: ['./annulation.component.scss']
})
export class AnnulationComponent {

  id: string | null = null;
  reservation: Reservation | null = null;

  constructor(private reservationService: AnnulationService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log('ID:', this.id);

      this.loadReservation();
    });
  }

  
  loadReservation() {
    if (this.id) {
      this.reservationService.getReservationById(this.id).subscribe(
        (data: Reservation) => {
          this.reservation = data;
        },
        (error) => {
          console.error('Une erreur est survenue lors de la récupération de la réservation', error);
        }
      );
    }
  }


  annulerReservation() {
    if (this.reservation && this.reservation._id) {
      this.reservationService.annulerReservationById(this.reservation._id).subscribe(
        () => {
          console.log('Réservation annulée avec succès');
          // Vous pouvez effectuer des actions supplémentaires après l'annulation de la réservation ici
        },
        (error) => {
          console.error('Une erreur est survenue lors de l\'annulation de la réservation', error);
        }
      );
    }
}
}