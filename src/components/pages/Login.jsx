import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/layouts/Root';
import { useSelector } from 'react-redux';

function Login() {
  const { isInitialized } = useAuth();
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isInitialized) {
      const { ApperUI } = window.ApperSDK;
      if(!user) {
        ApperUI.showLogin("#authentication");
      }else{
        const searchParams = new URLSearchParams(window.location.search);
        const redirectPath = searchParams.get('redirect');
        navigate(redirectPath ? redirectPath : "/");
      }
    }
  }, [isInitialized, user, navigate]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-darker">
      <div className="w-full max-w-md space-y-8 p-8 bg-slate-dark rounded-lg shadow-md">
        <div className="flex flex-col gap-6 items-center justify-center">
<div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-ocean-gradient text-white text-2xl 2xl:text-3xl font-bold">
            D
          </div>
          <div>
            <div className="text-2xl 2xl:text-3xl font-bold text-slate-800 mb-2">
              Sign in to DepthRoom Studio
            </div>
            <div className="text-center text-sm text-gray-400">
              Welcome back, please sign in to continue
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-ocean-teal hover:text-ocean-teal/80">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;