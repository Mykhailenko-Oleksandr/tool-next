export interface Booked {
  id: string;
  userId: string;
  tool: {
    id: string;
    name: string;
    pricePerDay: number;
  };
  customerInfo: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  rentalPeriod: {
    startDate: string;
    endDate: string;
    days: number;
  };
  delivery: {
    city: string;
    branch: string;
  };
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
  endDate: string;
  deliveryCity: string;
  deliveryBranch: string;
}
