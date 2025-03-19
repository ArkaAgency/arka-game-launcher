import { SettingsIcon } from 'lucide-react';
import clsx from 'clsx';
import defaultProfilePicture from '../../../images/default_pfp.jpg';
import cobblemonIcon from '../../../images/cobblemon.png';
import backroomIcon from '../../../images/backrooms.jpg';
import baldiIcon from '../../../images/baldi.jpg';
import { useEffect, useState } from 'react';
import { UserData } from '../../auth/process-microsoft-auth';
import renderGetUserData from '../../renderer-api/user-data.caller';

export default function MainSidebar({
  view,
  onViewChange,
}: {
  view: string;
  onViewChange: (v: string) => void;
}) {
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

  return (
    <nav className="w-fit h-full bg-black/25 py-6 px-4 flex flex-col items-center justify-between">
      <button
        type="button"
        className={clsx(
          'flex items-center justify-center rounded-xl bg-neutral-800 border border-neutral-700 p-2',
          view === 'profile' ? 'bg-white' : 'hover:bg-neutral-700',
        )}
        onClick={() => onViewChange('profile')}
      >
        <img
          src={`https://mc-heads.net/avatar/${userData?.profile.id}/100`}
          className="aspect-square w-16 rounded-xl"
          alt="Profile"
        />
      </button>
      <menu className="rounded-lg p-2 bg-neutral-900 flex items-center justify-center">
        <ul className="flex flex-col items-center justify-center gap-2">
          <li>
            <button
              type="button"
              className={clsx(
                'w-16 h-16 bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center',
                view === 'cobblemon' ? 'bg-white' : 'hover:bg-neutral-700',
              )}
              onClick={() => onViewChange('cobblemon')}
            >
              <img
                src={cobblemonIcon}
                className="w-12 h-12 grayscale"
                alt="Cobblemon icon"
              />
            </button>
          </li>
          <li>
            <button
              type="button"
              className={clsx(
                'w-16 h-16 bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center',
                view === 'backrooms' ? 'bg-white' : 'hover:bg-neutral-700',
              )}
              onClick={() => onViewChange('backrooms')}
            >
              <img
                src={backroomIcon}
                className="w-12 h-12 rounded-xl grayscale"
                alt="Backrooms icon"
              />
            </button>
          </li>
          <li>
            <button
              type="button"
              className={clsx(
                'w-16 h-16 bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center',
                view === 'baldi' ? 'bg-white' : 'hover:bg-neutral-700',
              )}
              onClick={() => onViewChange('baldi')}
            >
              <img
                src={baldiIcon}
                className="w-12 h-12 rounded-xl grayscale"
                alt="Baldi icon"
              />
            </button>
          </li>
        </ul>
      </menu>
      <button
        type="button"
        className={clsx(
          'w-16 h-16 bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center p-4',
          view === 'settings' ? 'bg-white text-black' : 'hover:bg-neutral-700',
        )}
        onClick={() => onViewChange('settings')}
      >
        <SettingsIcon className="w-full h-full" strokeWidth={2} /> {}
      </button>
    </nav>
  );
}
