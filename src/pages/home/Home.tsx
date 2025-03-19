import { useState } from 'react';
import LightHeader from '../../features/layout/LightHeader';
import MainSidebar from '../../features/layout/main-sidebar/main-sidebar';
import CobblemonView from './views/cobblemon';
import SettingsView from './views/settings';
import BackroomsView from './views/backrooms';
import BaldiView from './views/baldi';
import ProfileView from './views/profile';

export default function HomePage() {
  const [view, setView] = useState('cobblemon');

  const handleViewChange = (newView: string) => {
    setView(newView);
  };

  return (
    <div className="w-full h-full relative">
      <LightHeader />
      <div className="h-full w-full flex">
        <MainSidebar view={view} onViewChange={handleViewChange} />
        <div className="p-6 w-full h-full">
          {view === 'profile' ? <ProfileView /> : ''}
          {view === 'cobblemon' ? <CobblemonView /> : ''}
          {view === 'backrooms' ? <BackroomsView /> : ''}
          {view === 'baldi' ? <BaldiView /> : ''}
          {view === 'settings' ? <SettingsView /> : ''}
        </div>
      </div>
    </div>
  );
}
