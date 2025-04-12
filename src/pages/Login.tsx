
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-lifesage-light to-white flex flex-col justify-center">
      <div className="text-center mb-8">
        <Link to="/" className="inline-block">
          <h1 className="text-3xl font-bold text-lifesage-primary">LifeSage Health</h1>
          <p className="text-gray-600">Healthcare for everyone, everywhere</p>
        </Link>
      </div>

      <LoginForm />
    </div>
  );
};

export default Login;
