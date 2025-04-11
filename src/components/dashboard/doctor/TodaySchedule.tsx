
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Video } from 'lucide-react';

interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: string;
  notes: string | null;
}

interface TodayScheduleProps {
  appointments: Appointment[];
  loading: boolean;
  startVideoConsultation: (patientName: string) => void;
}

const TodaySchedule: React.FC<TodayScheduleProps> = ({ 
  appointments, 
  loading, 
  startVideoConsultation 
}) => {
  const todayAppointments = appointments.filter(appointment => 
    new Date(appointment.appointment_date).toDateString() === new Date().toDateString()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Today's Schedule
        </CardTitle>
        <CardDescription>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lifesage-primary"></div>
            <p className="mt-2 text-gray-500">Loading appointments...</p>
          </div>
        ) : todayAppointments.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No appointments scheduled for today.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map(appointment => (
              <div 
                key={appointment.id} 
                className={`flex justify-between items-center p-3 rounded-lg border
                  ${appointment.status === 'active' ? 'bg-green-50 border-green-200' : 'bg-white'}
                `}
              >
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{appointment.patient_name}</span>
                    {appointment.status === 'active' && (
                      <Badge className="ml-2 bg-green-500">In Progress</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {appointment.reason} • {appointment.appointment_time}
                  </p>
                </div>
                <Button 
                  variant={appointment.status === 'active' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => startVideoConsultation(appointment.patient_name)}
                >
                  <Video className="h-4 w-4 mr-1" />
                  {appointment.status === 'active' ? 'Join Now' : 'Start Call'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaySchedule;
