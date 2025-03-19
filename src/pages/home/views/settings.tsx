import CreativeCheckbox from '../../../features/components/creative-checkbox';

export default function SettingsView() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Settings</h2>
      <CreativeCheckbox
        id="updates"
        label="Automatic Updates"
        description="Automatically check for new updates at Launcher startup."
        defaultChecked
        disabled
      />
    </div>
  );
}
