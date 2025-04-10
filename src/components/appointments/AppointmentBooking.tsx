
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiology" },
  { id: 2, name: "Dr. Michael Chen", specialization: "Neurology" },
  { id: 3, name: "Dr. Emily Rodriguez", specialization: "Pediatrics" },
  { id: 4, name: "Dr. David Williams", specialization: "Dermatology" },
  { id: 5, name: "Dr. Jessica Lee", specialization: "Psychiatry" }
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

const AppointmentBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedDoctor || !selectedTime || !reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to book your appointment.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, this would save to the database
      // For now, we'll just simulate a successful booking
      
      setTimeout(() => {
        toast({
          title: "Appointment Booked!",
          description: `Your appointment with ${selectedDoctor} on ${selectedDate.toLocaleDateString()} at ${selectedTime} has been confirmed.`,
        });
        
        // Reset form
        setSelectedDate(undefined);
        setSelectedDoctor("");
        setSelectedTime("");
        setReason("");
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>Schedule a consultation with one of our healthcare professionals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="doctor">Select Doctor</Label>
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger id="doctor">
              <SelectValue placeholder="Choose a doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map(doctor => (
                <SelectItem key={doctor.id} value={doctor.name}>
                  {doctor.name} - {doctor.specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
