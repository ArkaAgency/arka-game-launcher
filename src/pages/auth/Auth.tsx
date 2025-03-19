import { useEffect, useTransition } from 'react';
import { InfoIcon, LoaderIcon, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../features/layout/Header';
import appleIcon from '../../images/apple_icon.png';
import googleIcon from '../../images/google_icon.png';
import microsoftIcon from '../../images/microsoft_icon.png';
import rendererIsAuthenticated from '../../features/renderer-api/auth-checker.caller';

export default function AuthPage() {
  const navigate = useNavigate();
  const [loading, startLoading] = useTransition();

  const authenticationDone = () => {
    window.electron.ipcRenderer.sendMessage('set-size', {
      w: 1200,
      h: 720,
    });
    navigate('/home', { replace: true });
  };

  useEffect(() => {
    rendererIsAuthenticated()
      .then((isAuthenticated) => {
        if (isAuthenticated) {
          window.electron.ipcRenderer.sendMessage('set-size', {
            w: 1200,
            h: 720,
          });
          navigate('/home', { replace: true });
        } else {
          window.electron.ipcRenderer.sendMessage('set-size', {
            w: 580,
            h: 720,
          });
        }
        return isAuthenticated;
      })
      .catch((err) => {
        return err;
      });
  }, [navigate]);

  const handleMicrosoft = () => {
    startLoading(() => {
      window.electron.ipcRenderer
        .invoke('microsoft-auth')
        .then((data) => {
          if (data.success) {
            authenticationDone();
          }
          return data;
        })
        .catch((err) => {
          return err;
        });
    });
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-full w-full overflow-hidden">
        <div className="bg-black/50 rounded-lg p-5 max-w-[400px] ">
          <div className="mb-4">
            <h2 className="font-bold text-center text-lg mb-1">
              Let&apos;s Sign In
            </h2>
            <p className="text-center text-sm">
              Sign In to your Kepler Studio account now to discover our
              fantastic gaming projects!
            </p>
          </div>
          <div className="mb-4">
            <button
              className="relative w-full h-14 rounded-lg border-2 border-gray-700 mb-3 font-medium text-slate-200 disabled:text-gray-700 disabled:cursor-not-allowed"
              type="button"
              disabled
            >
              <img
                src={googleIcon}
                alt="Google Icon"
                className="absolute left-6 top-4 bottom-4 h-5 w-5 grayscale opacity-50"
              />
              Continue with Google
            </button>
            <button
              className="relative w-full h-14 rounded-lg border-2 border-gray-700 mb-3 font-medium text-slate-200 disabled:text-gray-700 disabled:cursor-not-allowed"
              type="button"
              disabled
            >
              <img
                src={appleIcon}
                alt="Apple Icon"
                className="absolute left-6 top-4 bottom-4 h-5 w-4  grayscale opacity-50"
              />
              Continue with Apple
            </button>
            <button
              className="group relative w-full h-14 rounded-lg border-2 border-gray-700 mb-3 font-medium text-slate-200 hover:bg-gray-900 transition-all duration-200"
              type="button"
              onClick={handleMicrosoft}
            >
              <img
                src={microsoftIcon}
                alt="Microsoft Icon"
                className="absolute left-6 top-4 bottom-4 h-5 w-5"
              />
              {loading ? <LoaderIcon className="animate-spin" /> : ''}Continue
              with Microsoft
              <span className="absolute right-0 -bottom-5 flex items-center gap-1 text-sm bg-blue-600 p-1 px-2 rounded transition-all duration-300 opacity-100 translate-x-0  group-hover:translate-x-72 group-hover:opacity-0">
                <InfoIcon size={18} /> Recommended for Cobblemon
              </span>
            </button>
          </div>
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="w-full bg-gray-600 h-[2px]" />
            <p className="text-gray-300 px-2 uppercase font-medium text-sm">
              or
            </p>
            <div className="w-full bg-gray-600 h-[2px]" />
          </div>
          <div>
            <input
              type="text"
              className="border border-gray-600 font-normal p-3 bg-transparent w-full rounded-lg mb-3 disabled:placeholder:text-gray-600 disabled:cursor-not-allowed"
              placeholder="Enter your mail address here"
              disabled
            />
            <button
              className="relative w-full bg-gray-200 text-black rounded-lg font-medium p-3 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              disabled
            >
              <Mail className="absolute left-6 top-3 bottom-2" scale="icon" />
              Continue with email
            </button>
            <div className="flex items-center justify-center mb-5">
              <p className="text-center w-3/4 text-sm text-gray-400">
                By proceeding, you agree to our{' '}
                <a
                  href="https://kepler-studio.com/terms?origin=games"
                  className="text-gray-200 hover:underline"
                >
                  Terms
                </a>{' '}
                and{' '}
                <a
                  href="https://kepler-studio.com/privacy?origin=games"
                  className="text-gray-200 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
            {/* 
            <p className="text-center text-sm font-medium text-gray-400">
              Already have an account?{' '}
              <a
                href="https://kepler-studio.com/privacy?origin=games"
                className="text-blue-500 hover:underline"
              >
                Log In
              </a>
            </p> */}
          </div>
        </div>
      </div>
    </>
  );
}
