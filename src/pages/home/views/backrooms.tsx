import { SparklesIcon } from 'lucide-react';

export default function BackroomsView() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
      <div className="mx-auto text-center">
        <div className="inline-flex items-center px-3 py-1 mb-8 text-xs font-medium rounded-full bg-orange-600 text-primary-foreground backdrop-blur-sm animate-bounce">
          <SparklesIcon className="w-3 h-3 mr-2" />
          Something amazing is brewing
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          It&apos;s <span className="text-orange-400">Coming Soon</span>
        </h1>

        <p className="text-xl md:text-2xl text-neutral-300 mb-12 max-w-xl mx-auto">
          We&apos;re working on something extraordinary. Come soon to check when
          it launches.
        </p>
      </div>
    </div>
  );
}
