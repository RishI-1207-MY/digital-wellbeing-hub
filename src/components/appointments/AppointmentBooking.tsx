
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Doctor {
  id: string;
  specialty: string;
  full_name: string;
}

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

const AppointmentBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select(`
            id,
            specialty,
            profiles (
              full_name
            )
          `);

        if (error) throw error;

        const formattedDoctors = data.map(doc => ({
          id: doc.id,
          specialty: doc.specialty,
          full_name: doc.profiles.full_name
        }));

        setDoctors(formattedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setFetchingDoctors(false);
      }
    };

    fetchDoctors();
  }, [toast]);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedDoctor || !selectedTime || !reason || !user?.id) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to book your appointment.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Format date for database
      const formattedDate = selectedDate.toISOString().split('T')[0];

      // Insert appointment into database
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          doctor_id: selectedDoctor,
          appointment_date: formattedDate,
          appointment_time: selectedTime,
          reason: reason,
          status: 'pending'
        })
        .select();

      if (error) throw error;

      toast({
        title: "Appointment Booked!",
        description: `Your appointment on ${selectedDate.toLocaleDateString()} at ${selectedTime} has been confirmed.`,
      });
      
      // Reset form
      setSelectedDate(undefined);
      setSelectedDoctor("");
      setSelectedTime("");
      setReason("");
    } catch (error: any) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctorName = doctors.find(d => d.id === selectedDoctor)?.full_name || "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>Schedule a consultation with one of our healthcare professionals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="doctor">Select Doctor</Label>
          {fetchingDoctors ? (
            <div className="text-sm text-gray-500">Loading doctors...</div>
          ) : (
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger id="doctor">
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map(doctor => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.full_name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label>Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="border rounded-md p-2"
            disabled={(date) => {
              // Disable past dates and weekends
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const day = date.getDay();
              return date < today || day === 0 || day === 6;
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Select Time</Label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger id="time">
              <SelectValue placeholder="Choose a time slot" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(time => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Visit</Label>
          <Input
            id="reason"
            placeholder="Briefly describe your symptoms or reason for consultation"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleBookAppointment} 
          disabled={loading || !selectedDate || !selectedDoctor || !selectedTime || !reason}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentBooking;
