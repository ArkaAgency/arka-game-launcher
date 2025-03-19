import { UnplugIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../../../features/auth/process-microsoft-auth';
import renderGetUserData from '../../../features/renderer-api/user-data.caller';
import rendererAuthDisconnect from '../../../features/renderer-api/auth-disconnect.caller';

export default function ProfileView() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    renderGetUserData()
      .then((data) => {
        if (data) setUserData(data);
        return data;
      })
      .catch((err) => {
        return err;
      });
  });

  const handleDisconnect = () => {
    rendererAuthDisconnect()
      .then((success) => {
        if (success) navigate('/auth');
        return success;
      })
      .catch((err) => {
        return err;
      });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Profile</h2>
      <div className="flex items-center justify-between bg-neutral-800/50 border border-neutral-600/50 p-4 rounded-lg">
        <div className="flex items-center gap-6">
          <img
            src={`https://mc-heads.net/avatar/${userData?.profile.id}/100`}
            className="w-20 h-20 border-4 border-neutral-600 rounded-lg"
            alt="Profile"
          />
          <p className="text-xl font-bold">{userData?.profile.name}</p>
        </div>
        <button
          className="p-1 px-3 rounded-lg flex items-center gap-2 bg-red-500/90 border-2 border-red-700 hover:bg-red-600 transition-all duration-150 font-semibold"
          type="button"
          onClick={handleDisconnect}
        >
          <UnplugIcon className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
