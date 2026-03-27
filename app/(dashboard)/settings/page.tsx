import { SapConnectionForm } from "./SapConnectionForm";

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto p-6 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure your SAP system connection.</p>
      </div>
      <SapConnectionForm />
    </div>
  );
}
