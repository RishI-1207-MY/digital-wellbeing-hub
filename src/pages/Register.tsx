
import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lifesage-light to-white flex flex-col justify-center">
      <div className="text-center mb-8">
        <Link to="/" className="inline-block">
          <h1 className="text-3xl font-bold text-lifesage-primary">LifeSage Health</h1>
          <p className="text-gray-600">Healthcare for everyone, everywhere</p>
        </Link>
      </div>
      <RegisterForm />
    </div>
  );
};

export default Register;
