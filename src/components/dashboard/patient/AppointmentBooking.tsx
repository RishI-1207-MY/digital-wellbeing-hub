
import React from 'react';
import { Calendar } from 'lucide-react';
import ActionCard from './ActionCard';

const AppointmentBookingCard: React.FC = () => {
  const goToAppointments = () => {
    const appointmentsTab = document.querySelector('[data-value="appointments"]');
    if (appointmentsTab && appointmentsTab instanceof HTMLElement) {
      appointmentsTab.click();
    }
  };

  return (
    <ActionCard
      title="Book Appointment"
      description="Schedule an appointment with one of our healthcare providers"
      icon={Calendar}
      buttonText="Book Now"
      onClick={goToAppointments}
      className="bg-green-50 border-green-100"
      buttonVariant="default"
    />
  );
};

export default AppointmentBookingCard;
