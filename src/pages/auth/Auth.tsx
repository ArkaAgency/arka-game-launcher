import { Mail } from 'lucide-react';
import Header from '../../features/layout/Header';
import appleIcon from '../../images/apple_icon.png';
import googleIcon from '../../images/google_icon.png';
import microsoftIcon from '../../images/microsoft_icon.png';

export default function AuthPage() {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-full w-full">
        <div className="bg-black/50 rounded-lg p-5 max-w-[400px] ">
          <div className="mb-4">
            <h2 className="font-bold text-center text-lg mb-1">
              Create a free account
            </h2>
            <p className="text-center text-sm">
              Create your Arka account now to discover our fantastic gaming
              projects!
            </p>
          </div>
          <div className="mb-4">
            <button
              className="relative w-full h-14 rounded-lg border-2 border-gray-700 mb-3 font-medium text-slate-200"
              type="button"
            >
              <img
                src={googleIcon}
                alt="Google Icon"
                className="absolute left-6 top-4 bottom-4 h-5 w-5"
              />
              Sign up with Google
            </button>
            <button
              className="relative w-full h-14 rounded-lg border-2 border-gray-700 mb-3 font-medium text-slate-200"
              type="button"
            >
              <img
                src={appleIcon}
                alt="Apple Icon"
                className="absolute left-6 top-4 bottom-4 h-5 w-4"
              />
              Sign up with Apple
            </button>
            <button
              className="relative w-full h-14 rounded-lg border-2 border-gray-700 mb-3 font-medium text-slate-200"
              type="button"
            >
              <img
                src={microsoftIcon}
                alt="Microsoft Icon"
                className="absolute left-6 top-4 bottom-4 h-5 w-5"
              />
              Sign up with Microsoft
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
              className="border border-gray-600 font-normal p-3 bg-transparent w-full rounded-lg mb-3"
              placeholder="Enter your mail address here"
            />
            <button
              className="relative w-full bg-gray-200 text-black rounded-lg font-medium p-3 mb-4"
              type="button"
            >
              <Mail className="absolute left-6 top-3 bottom-2" scale="icon" />
              Sign up with email
            </button>
            <div className="flex items-center justify-center mb-5">
              <p className="text-center w-3/4 text-sm text-gray-400">
                By proceeding, you agree to our{' '}
                <a
                  href="https://arka-group.io/terms?origin=games"
                  className="text-gray-200 hover:underline"
                >
                  Terms
                </a>{' '}
                and{' '}
                <a
                  href="https://arka-group.io/privacy?origin=games"
                  className="text-gray-200 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
            <p className="text-center text-sm font-medium text-gray-400">
              Already have an account?{' '}
              <a
                href="https://arka-group.io/privacy?origin=games"
                className="text-blue-500 hover:underline"
              >
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
