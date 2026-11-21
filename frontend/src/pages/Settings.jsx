
import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Lock,
  Mail,
  Sprout,
  CheckCircle,
  Info,
  Settings as SettingsIcon,
  Leaf,
  ChevronRight,
} from "lucide-react";

function Settings() {
  const [name, setName] = useState("Saheli Singharoy");
  const [email, setEmail] = useState("saheli@example.com");
  const [role] = useState("User");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [diseaseAlerts, setDiseaseAlerts] = useState(true);
  const [sensorAlerts, setSensorAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  const [theme, setTheme] = useState("Light");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 shrink-0 rounded-full transition-all duration-300 ${
        checked ? "bg-emerald-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
          checked ? "left-7" : "left-1"
        }`}
      />
    </button>
  );

  const SectionHeading = ({ icon: Icon, title, description, color }) => (
    <div className="flex items-center gap-4 mb-7">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={23} />
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          {title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {description}
        </p>
      </div>
    </div>
  );

  const notificationItems = [
    {
      title: "Email Notifications",
      description: "Receive important updates through email.",
      checked: emailNotifications,
      change: setEmailNotifications,
    },
    {
      title: "Disease Detection Alerts",
      description: "Get notified about detected plant diseases.",
      checked: diseaseAlerts,
      change: setDiseaseAlerts,
    },
    {
      title: "Sensor Notifications",
      description: "Receive updates about sensor readings.",
      checked: sensorAlerts,
      change: setSensorAlerts,
    },
    {
      title: "Weekly Reports",
      description: "Receive a weekly plant health summary.",
      checked: weeklyReports,
      change: setWeeklyReports,
    },
  ];

  return (
    <div className="space-y-7 pb-8">

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#064e3b] via-[#08764e] to-[#159765] p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute right-32 -bottom-24 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-emerald-100 text-sm mb-3">
              <SettingsIcon size={16} />
              <span>Account Preferences</span>
              <ChevronRight size={14} />
              <span>Settings</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold">
              Settings & Preferences
            </h1>

            <p className="text-emerald-100 mt-2 text-sm sm:text-base max-w-xl">
              Manage your account, notifications and application preferences
              from one place.
            </p>
          </div>

          <div className="hidden sm:flex w-20 h-20 rounded-2xl bg-white/15 border border-white/20 items-center justify-center">
            <SettingsIcon size={38} />
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <section className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-sm">
        <SectionHeading
          icon={User}
          title="Profile Information"
          description="Manage your personal account information."
          color="bg-emerald-50 text-emerald-700"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>

            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 bg-gray-50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition">
              <User size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3 bg-transparent outline-none text-gray-700 text-sm"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 bg-gray-50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition">
              <Mail size={18} className="text-gray-400 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 bg-transparent outline-none text-gray-700 text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Account Role
            </label>

            <input
              type="text"
              value={role}
              readOnly
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100 text-gray-500 outline-none text-sm cursor-not-allowed"
            />
          </div>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-sm">
        <SectionHeading
          icon={Bell}
          title="Notification Preferences"
          description="Choose the updates you want to receive."
          color="bg-blue-50 text-blue-700"
        />

        <div className="divide-y divide-gray-100">
          {notificationItems.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>

              <Toggle
                checked={item.checked}
                onChange={item.change}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-sm">
        <SectionHeading
          icon={Palette}
          title="Appearance"
          description="Choose your preferred application appearance."
          color="bg-purple-50 text-purple-700"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["Light", "Dark"].map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setTheme(item)}
              className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                theme === item
                  ? "border-emerald-600 bg-emerald-50/70 shadow-sm"
                  : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-full h-24 rounded-xl mb-4 flex items-center justify-center border ${
                  item === "Light"
                    ? "bg-gray-100 border-gray-200"
                    : "bg-gray-800 border-gray-700"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Sprout
                    size={30}
                    className={
                      item === "Light" ? "text-emerald-700" : "text-emerald-400"
                    }
                  />
                  <span
                    className={`text-xs font-medium ${
                      item === "Light" ? "text-gray-600" : "text-gray-200"
                    }`}
                  >
                    AgriTwin Preview
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">
                  {item} Mode
                </span>

                {theme === item && (
                  <CheckCircle size={20} className="text-emerald-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4 flex items-start gap-2">
          <Info size={15} className="shrink-0 mt-0.5" />
          Theme selection is currently a frontend demo preference. It does not
          change the entire application theme.
        </p>
      </section>

      {/* Security */}
      <section className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-sm">
        <SectionHeading
          icon={Shield}
          title="Security Settings"
          description="Review your account security information."
          color="bg-orange-50 text-orange-700"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 border border-gray-100 p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-gray-500 shadow-sm">
              <Lock size={21} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Password Protection
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Your account uses password-based login.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-2 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Enabled
          </span>
        </div>
      </section>

      {/* Save Changes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {saved ? (
            <p className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
              <CheckCircle size={18} />
              Settings saved for this session.
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Review your preferences before saving.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white px-7 py-3.5 rounded-xl font-semibold shadow-md shadow-emerald-900/10 transition-all"
        >
          <Save size={19} />
          Save Changes
        </button>
      </div>

      {/* Demo Information */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 p-4 sm:p-5 rounded-2xl">
        <Info className="text-amber-700 shrink-0 mt-0.5" size={20} />

        <div>
          <h3 className="text-sm font-semibold text-amber-900">
            Demo Information
          </h3>
          <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
            Settings are currently frontend demonstration features. Permanent
            profile updates, notification preferences and security management
            will require backend integration.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Settings;
