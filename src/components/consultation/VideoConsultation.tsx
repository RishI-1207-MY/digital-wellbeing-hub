
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Phone, PhoneOff, Mic, MicOff, Video, VideoOff, UserPlus, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';

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

interface VideoConsultationProps {
  userRole: 'doctor' | 'patient';
}

const VideoConsultation: React.FC<VideoConsultationProps> = ({ userRole }) => {
  const [consultation, setConsultation] = useState<ConsultationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [consultationEnded, setConsultationEnded] = useState(false);
  const [patientList, setPatientList] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
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

        // Hardcoded user role for demo
        setUser({
          id: session.user.id,
          name: session.user.email || 'User',
          role: userRole // Use the provided userRole
        });

        // For demo, create a mock consultation
        if (userRole === 'patient') {
          const mockConsultation: ConsultationData = {
            id: 'mock-consultation-id',
            patient_id: session.user.id,
            doctor_id: null,
            status: 'scheduled',
            scheduled_at: new Date().toISOString()
          };
          setConsultation(mockConsultation);
        } else {
          // If doctor, load list of patients
          // In a real app, this would fetch from Supabase
          setPatientList([
            { id: 'patient-1', name: 'Sarah Johnson', status: 'waiting' },
            { id: 'patient-2', name: 'Robert Garcia', status: 'scheduled' },
            { id: 'patient-3', name: 'Emily Martinez', status: 'scheduled' },
            { id: 'patient-4', name: 'James Wilson', status: 'emergency' },
          ]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in consultation setup:', error);
        toast({
          title: "Error",
          description: "Failed to set up consultation. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      // Clean up media stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast, userRole]);

  const startConsultation = async (patientId?: string) => {
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

      // In a real app, we would:
      // 1. Create a WebRTC connection
      // 2. Exchange signaling data via Supabase Realtime
      // 3. Connect the peers
      // 4. Show remote video in remoteVideoRef

      // For demo purposes, we're simulating a peer connection
      setTimeout(() => {
        // Add some simulated remote video for demo purposes
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          // In a real implementation, this would be the other user's stream
        }
        setIsConnecting(false);
        setIsConnected(true);
        
        const otherParty = userRole === 'doctor' 
          ? patientList.find(p => p.id === patientId)?.name || 'the patient'
          : 'your healthcare provider';
        
        toast({
          title: "Consultation Started",
          description: `You are now connected with ${otherParty}.`,
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

  // Doctor view of video consultation
  if (userRole === 'doctor') {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Video Consultations</CardTitle>
          <CardDescription>
            {isConnected 
              ? `In consultation with patient${selectedPatient ? `: ${patientList.find(p => p.id === selectedPatient)?.name}` : ''}`
              : consultationEnded 
                ? "Consultation has ended"
                : "Connect with your patients via secure video call"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          {!isConnected && !consultationEnded ? (
            <Tabs defaultValue="waiting">
              <TabsList className="mb-4">
                <TabsTrigger value="waiting">Waiting Room</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
              
              <TabsContent value="waiting" className="space-y-4">
                <h3 className="text-lg font-medium">Patients Waiting</h3>
                {patientList.filter(p => p.status === 'waiting' || p.status === 'emergency').length === 0 ? (
                  <p className="text-gray-500">No patients currently waiting</p>
                ) : (
                  patientList
                    .filter(p => p.status === 'waiting' || p.status === 'emergency')
                    .map(patient => (
                      <div 
                        key={patient.id} 
                        className={`p-4 border rounded-lg flex justify-between items-center
                          ${patient.status === 'emergency' ? 'bg-red-50 border-red-200' : 'bg-white'}`}
                      >
                        <div>
                          <div className="font-medium flex items-center">
                            {patient.name}
                            {patient.status === 'emergency' && (
                              <Badge className="ml-2 bg-red-500">Emergency</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {patient.status === 'emergency' ? 'Urgent assistance needed' : 'Waiting for consultation'}
                          </p>
                        </div>
                        <Button 
                          onClick={() => {
                            setSelectedPatient(patient.id);
                            startConsultation(patient.id);
                          }}
                          className={patient.status === 'emergency' ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          {patient.status === 'emergency' ? 'Respond Now' : 'Start Call'}
                        </Button>
                      </div>
                    ))
                )}
              </TabsContent>
              
              <TabsContent value="scheduled" className="space-y-4">
                <h3 className="text-lg font-medium">Upcoming Consultations</h3>
                {patientList.filter(p => p.status === 'scheduled').length === 0 ? (
                  <p className="text-gray-500">No scheduled consultations</p>
                ) : (
                  patientList
                    .filter(p => p.status === 'scheduled')
                    .map(patient => (
                      <div key={patient.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <p className="text-sm text-gray-500">Scheduled for today</p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setSelectedPatient(patient.id);
                            startConsultation(patient.id);
                          }}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Start Call
                        </Button>
                      </div>
                    ))
                )}
              </TabsContent>
            </Tabs>
          ) : consultationEnded ? (
            <div className="text-center p-6">
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="font-medium text-lg mb-2">Consultation Completed</h3>
                <p className="text-gray-600">
                  Consultation has ended. Don't forget to update the patient's records.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setConsultationEnded(false);
                  setSelectedPatient(null);
                }}
              >
                Return to Patient List
              </Button>
            </div>
          ) : (
            <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
              {/* Remote video (patient) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Local video (doctor) - small overlay */}
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
  }

  // Patient view of video consultation
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
                onClick={() => startConsultation()}
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

// Helper component for badge
const Badge = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${className}`}>
    {children}
  </span>
);

export default VideoConsultation;
