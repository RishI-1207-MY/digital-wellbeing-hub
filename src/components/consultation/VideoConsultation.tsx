
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Peer from 'simple-peer';

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor';
}

interface ConsultationData {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  status: string;
  scheduled_at: string | null;
}

const VideoConsultation = () => {
  const [consultation, setConsultation] = useState<ConsultationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [consultationEnded, setConsultationEnded] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please log in to access video consultations",
            variant: "destructive",
          });
          return;
        }

        // Hardcoded user role for demo - in a real app, this would come from a user profile
        setUser({
          id: session.user.id,
          name: session.user.email || 'User',
          role: 'patient' // Assuming patient role for demo
        });

        // For demo, create a mock consultation if none exists
        const { data: existingConsultations, error: fetchError } = await supabase
          .from('consultations')
          .select('*')
          .eq('patient_id', session.user.id)
          .eq('status', 'scheduled')
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching consultations:', fetchError);
          throw fetchError;
        }

        if (existingConsultations) {
          setConsultation(existingConsultations);
        } else {
          // Create a demo consultation
          const { data: newConsultation, error: createError } = await supabase
            .from('consultations')
            .insert({
              patient_id: session.user.id,
              doctor_id: null, // Will be assigned later
              status: 'scheduled',
              scheduled_at: new Date().toISOString()
            })
            .select('*')
            .single();

          if (createError) {
            console.error('Error creating consultation:', createError);
            throw createError;
          }

          setConsultation(newConsultation);
        }
      } catch (error) {
        console.error('Error in consultation setup:', error);
        toast({
          title: "Error",
          description: "Failed to set up consultation. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      // Clean up media stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [toast]);

  const startConsultation = async () => {
    try {
      setIsConnecting(true);
      
      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: isVideoOn, 
        audio: true 
      });
      
      streamRef.current = stream;
      
      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Update consultation status
      if (consultation) {
        const { error } = await supabase
          .from('consultations')
          .update({ 
            status: 'in-progress',
            joined_at: new Date().toISOString()
          })
          .eq('id', consultation.id);

        if (error) {
          console.error('Error updating consultation status:', error);
          throw error;
        }
      }

      // For demo purposes, we're simulating a peer connection
      // In a real app, this would involve WebRTC signaling with the doctor
      setTimeout(() => {
        // Add some simulated remote video for demo purposes
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          // In a real implementation, this would be the doctor's stream
        }
        setIsConnecting(false);
        setIsConnected(true);
        
        toast({
          title: "Consultation Started",
          description: "You are now connected with your healthcare provider.",
        });
      }, 2000);
      
    } catch (error: any) {
      console.error('Error starting consultation:', error);
      setIsConnecting(false);
      
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to start video consultation",
        variant: "destructive",
      });
    }
  };

  const endConsultation = async () => {
    try {
      // Stop media tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Clean up peer connection
      if (peerRef.current) {
        peerRef.current.destroy();
      }

      // Update consultation status
      if (consultation) {
        const { error } = await supabase
          .from('consultations')
          .update({ 
            status: 'completed',
            ended_at: new Date().toISOString()
          })
          .eq('id', consultation.id);

        if (error) {
          console.error('Error updating consultation status:', error);
          throw error;
        }
      }

      setIsConnected(false);
      setConsultationEnded(true);
      
      toast({
        title: "Consultation Ended",
        description: "Your video consultation has ended.",
      });
    } catch (error: any) {
      console.error('Error ending consultation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to end consultation properly",
        variant: "destructive",
      });
    }
  };

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  if (loading) {
    return (
      <Card className="flex items-center justify-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-500">Loading your consultation...</p>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Video Consultation</CardTitle>
        <CardDescription>
          {isConnected 
            ? "Connected with your healthcare provider" 
            : consultationEnded 
              ? "Consultation has ended"
              : "Start your scheduled healthcare consultation"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col items-center justify-center relative">
        {!isConnected && !consultationEnded ? (
          <div className="text-center">
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="font-medium text-lg mb-2">Ready to start your consultation?</h3>
              <p className="text-gray-600 mb-4">
                Connect with your healthcare provider via secure video call.
              </p>
              <Button
                onClick={startConsultation}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-4 w-4" />
                    Start Consultation
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Please ensure your camera and microphone are working properly before starting.
            </p>
          </div>
        ) : consultationEnded ? (
          <div className="text-center p-6">
            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <h3 className="font-medium text-lg mb-2">Consultation Completed</h3>
              <p className="text-gray-600">
                Thank you for using LifeSage Health for your virtual consultation.
                Any follow-up information will be sent to your account.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                // In a real app, this would navigate back to dashboard
                window.location.reload();
              }}
            >
              Return to Dashboard
            </Button>
          </div>
        ) : (
          <>
            <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
              {/* Remote video (doctor) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Local video (patient) - small overlay */}
              <div className="absolute bottom-4 right-4 w-32 h-24 rounded-lg overflow-hidden border-2 border-white">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      {isConnected && (
        <CardFooter className="justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            className={isMuted ? "bg-red-100" : ""}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVideo}
            className={!isVideoOn ? "bg-red-100" : ""}
          >
            {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={endConsultation}
            className="px-4"
          >
            <PhoneOff className="h-4 w-4 mr-2" />
            End Call
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default VideoConsultation;
