
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Temporary mock login logic
      const mockUsers = [
        { email: 'patient@example.com', password: 'password123', role: 'patient' },
        { email: 'doctor@example.com', password: 'password123', role: 'doctor' }
      ];
      
      const user = mockUsers.find(user => user.email === email && user.password === password);
      
      if (user) {
        localStorage.setItem('user', JSON.stringify({ email: user.email, role: user.role }));
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.role === 'doctor' ? 'Dr.' : ''} ${email.split('@')[0]}!`,
        });
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="#" className="text-sm font-medium text-lifesage-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          <div className="text-center text-sm mt-2">
            <span className="text-muted-foreground">Don't have an account?</span>{' '}
            <Link to="/register" className="font-medium text-lifesage-primary hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-sm text-center text-gray-500 mt-3">
            Demo accounts: <br />
            patient@example.com / password123 <br />
            doctor@example.com / password123
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
