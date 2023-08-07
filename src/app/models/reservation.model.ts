// models/reservation.model.ts

export class Reservation {
    _id: string;
    date: string;
    nombrePersonnes: number;
    hour: string;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    message: string;
    // Autres champs de la réservation
  
    constructor(reservationData: Partial<Reservation>) {
      this._id = '';
      this.date = '';
      this.nombrePersonnes = 0;
      this.hour = '';
      this.firstName = '';
      this.lastName = '';
      this.mobile = '';
      this.email = '';
      this.message = '';
      Object.assign(this, reservationData);
    }
  }
  