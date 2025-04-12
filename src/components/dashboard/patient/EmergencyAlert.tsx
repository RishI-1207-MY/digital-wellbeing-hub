
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ActionCard from './ActionCard';

const EmergencyAlert: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  
  const handleEmergencyAlert = () => {
    setEmergencyLoading(true);
    
    const createEmergencyAlert = async () => {
      if (!user?.id) return;
      
      try {
        const { error } = await supabase
          .from('consultations')
          .insert({
            patient_id: user.id,
            status: 'emergency',
          });
          
        if (error) throw error;
        
        toast({
          title: "Emergency Alert Sent",
          description: "Your healthcare provider has been notified. Stay calm and await contact.",
          variant: "destructive",
        });
      } catch (error) {
        console.error('Error sending emergency alert:', error);
        toast({
          title: "Error",
          description: "Failed to send emergency alert. Please call emergency services directly.",
          variant: "destructive",
        });
      } finally {
        setEmergencyLoading(false);
      }
    };
    
    createEmergencyAlert();
  };

  return (
    <ActionCard
      title="Emergency Alert"
      description="Use only in case of medical emergency requiring immediate attention"
      icon={Bell}
      buttonText={emergencyLoading ? "Sending Alert..." : "Send Emergency Alert"}
      onClick={handleEmergencyAlert}
      className="bg-red-50 border-red-100"
      buttonVariant="destructive"
    />
  );
};

export default EmergencyAlert;
