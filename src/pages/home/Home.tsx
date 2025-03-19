import LightHeader from '../../features/layout/LightHeader';
import MainSidebar from '../../features/layout/main-sidebar/main-sidebar';

export default function HomePage() {
  return (
    <div className="w-full h-full relative">
      <LightHeader />
      <div className="h-full w-full">
        <MainSidebar />
      </div>
    </div>
  );
}
