import defaultProfilePicture from '../../../images/default_pfp.jpg';
import cobblemonIcon from '../../../images/cobblemon.png';
import backroomIcon from '../../../images/backrooms.jpg';
import baldiIcon from '../../../images/baldi.jpg';
import { SettingsIcon, WrenchIcon } from 'lucide-react';

export default function MainSidebar() {
  return (
    <nav className="w-fit h-full bg-black/25 py-6 px-4 flex flex-col items-center justify-between">
      <button
        type="button"
        className="flex items-center justify-center rounded-xl bg-gray-800 hover:bg-white p-2"
      >
        <img
          src={defaultProfilePicture}
          className="aspect-square w-16 rounded-xl"
          alt="Profile"
        />
      </button>
      <menu className="rounded-lg p-2 bg-neutral-900 flex items-center justify-center">
        <ul className="flex flex-col items-center justify-center gap-2">
          <li>
            <button
              type="button"
              className="w-16 h-16 bg-white rounded-xl flex items-center justify-center"
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
              className="w-16 h-16 bg-neutral-800 border border-neutral-700 hover:bg-white rounded-xl flex items-center justify-center"
            >
              <img
                src={backroomIcon}
                className="w-12 h-12 rounded-xl grayscale"
                alt="Cobblemon icon"
              />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="w-16 h-16 bg-neutral-800 border border-neutral-700 hover:bg-white rounded-xl flex items-center justify-center"
            >
              <img
                src={baldiIcon}
                className="w-12 h-12 rounded-xl grayscale"
                alt="Cobblemon icon"
              />
            </button>
          </li>
        </ul>
      </menu>
      <button
        type="button"
        className="w-16 h-16 bg-neutral-800 border border-neutral-700 hover:bg-white hover:text-black rounded-xl flex items-center justify-center p-4"
      >
        <SettingsIcon className="w-full h-full" strokeWidth={2} /> {}
      </button>
    </nav>
  );
}
