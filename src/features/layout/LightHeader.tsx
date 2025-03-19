import {
  MaximizeIcon,
  Minus,
  PictureInPicture2Icon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';

function DragRegion() {
  return (
    <div id="drag" className="absolute left-0 top-0 bottom-0 right-[10.5rem]" />
  );
}

function HeaderButtons() {
  const [isMaximised, setMaximised] = useState(false);

  const handleMinimize = () => {
    window.electron.ipcRenderer.sendMessage('minimize');
  };

  const handleClose = () => {
    window.electron.ipcRenderer.sendMessage('close');
  };

  const handleToggleWindowMode = () => {
    setMaximised(!isMaximised);
  };

  window.electron.ipcRenderer.sendMessage('set-window-maximised', isMaximised);

  return (
    <div className="absolute flex right-0 top-0 h-14 w-fit">
      <button
        className="w-14 h-8 flex items-center justify-center transition-all duration-150 group bg-black/0 hover:bg-black/50"
        type="button"
        aria-label="Minimize"
        onClick={handleMinimize}
      >
        <Minus className="opacity-50 group-hover:opacity-75 transition-all duration-150 " />
      </button>
      <button
        className="w-14 h-8 flex items-center justify-center transition-all duration-150 group bg-black/0 hover:bg-black/50"
        type="button"
        aria-label="Toggle window mode"
        onClick={handleToggleWindowMode}
      >
        {isMaximised ? (
          <PictureInPicture2Icon className="opacity-50 group-hover:opacity-75 transition-all duration-150 h-6" />
        ) : (
          <MaximizeIcon className="opacity-50 group-hover:opacity-75 transition-all duration-150 h-6" />
        )}
      </button>
      <button
        className="w-14 h-8 flex items-center justify-center transition-all duration-150 group bg-black/0 hover:bg-red-500/25"
        type="button"
        aria-label="Close"
        onClick={handleClose}
      >
        <XIcon
          className="opacity-50 group-hover:opacity-75 transition-all duration-150"
          size={22}
        />
      </button>
    </div>
  );
}

export default function LightHeader() {
  return (
    <header className="absolute w-full left-0 right-0 top-0 h-8">
      <DragRegion />
      <HeaderButtons />
    </header>
  );
}
