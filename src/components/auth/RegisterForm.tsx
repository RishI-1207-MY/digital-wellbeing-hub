
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud } from 'lucide-react';

const specialties = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Obstetrics and Gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Urology",
  "General Practice"
];

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('patient');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [degree, setDegree] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDegree(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (userType === 'doctor' && !specialty) {
      toast({
        title: "Missing Information",
        description: "Please select your specialty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create metadata for user
      const metaData = userType === 'doctor' 
        ? { 
            name, 
            role: userType,
            specialty,
            experience: parseInt(experience) || 0
          }
        : { 
            name, 
            role: userType 
          };

      // Create user in Supabase Auth with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metaData
        }
      });
      
      if (error) throw error;
      
      // If it's a doctor and they've uploaded a degree file, store it
      if (userType === 'doctor' && degree && data.user) {
        const userId = data.user.id;
        const fileName = `${userId}_degree_verification.${degree.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('doctor_verifications')
          .upload(fileName, degree, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) {
          console.error('Error uploading degree:', uploadError);
          toast({
            title: "Warning",
            description: "Your account was created, but there was an issue uploading your degree verification. Please upload it later in your profile.",
            variant: "destructive",
          });
        }
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      
      // The trigger created in the database will automatically insert records into the profiles, doctors, or patients tables
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "There was an error creating your account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Join LifeSage Health to access quality healthcare
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>I am a:</Label>
            <RadioGroup defaultValue="patient" value={userType} onValueChange={setUserType} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="patient" id="patient" />
                <Label htmlFor="patient" className="cursor-pointer">Patient</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="doctor" id="doctor" />
                <Label htmlFor="doctor" className="cursor-pointer">Healthcare Provider</Label>
              </div>
            </RadioGroup>
          </div>
          
          {userType === 'doctor' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select value={specialty} onValueChange={setSpecialty} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="70"
                  placeholder="5"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="degree-upload">Degree Verification</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-gray-50">
                  <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload your medical degree or certification</p>
                  <p className="text-xs text-gray-400 mb-4">PDF, JPG or PNG up to 10MB</p>
                  <Input
                    id="degree-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('degree-upload')?.click()}
                  >
                    Select File
                  </Button>
                  {degree && (
                    <p className="mt-2 text-sm text-gray-700">
                      {degree.name} ({Math.round(degree.size / 1024)} KB)
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
          <div className="text-center text-sm mt-2">
            <span className="text-muted-foreground">Already have an account?</span>{' '}
            <Link to="/login" className="font-medium text-lifesage-primary hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
