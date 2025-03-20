import { ArrowBigDownDashIcon, SettingsIcon } from 'lucide-react';
import keplerIcon from '../../../images/keplericon.png';

export default function CobblemonView() {
  return (
    <div className="w-full h-full flex gap-16 py-12">
      <div className="w-full space-y-10 flex flex-col justify-end">
        <div className="space-y-2">
          <span className="p-1.5 px-3 text-sm uppercase rounded-lg border border-white">
            Most popular
          </span>
          <h2 className="text-5xl uppercase font-bold">
            COBBLEMON: GAY ACADEMY
          </h2>
          <p>Cobblemon: Gay Academy is a cool Cobblemon server.</p>
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="rounded-lg p-2 px-4 font-bold bg-green-500 hover:bg-green-600 transition-all flex items-center gap-3 text-lg"
          >
            <ArrowBigDownDashIcon className="w-6 h-6" /> Download
          </button>
          <button type="button" className="group">
            <SettingsIcon className="w-5 h-5 stroke-[2] group-hover:stroke-[3]" />{' '}
            {}
          </button>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl uppercase font-bold">Changelogs</h3>
          <div className="w-full max-w-80 min-h-24 bg-neutral-800 rounded-lg border border-neutral-700"></div>
        </div>
      </div>
      <div className="flex items-start justify-center">
        <img src={keplerIcon} alt={keplerIcon} className="w-20 h-20" />
      </div>
    </div>
  );
}
