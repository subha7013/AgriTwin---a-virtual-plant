
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
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
} from "lucide-react";

function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || user?.username || "AgriTwin Operator");
  const [email, setEmail] = useState(user?.email || "admin@agritwin.local");
  const role = user?.role || "Administrator";

  useEffect(() => {
    if (user) {
      if (user.name || user.username) setName(user.name || user.username);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

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
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full relative transition ${
        checked ? "bg-green-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
          checked ? "left-7" : "left-1"
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-7">

      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Settings ⚙️
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your AgriTwin account and application preferences.
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 text-green-700 rounded-xl">
            <User size={23} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Profile Information
            </h2>
            <p className="text-sm text-gray-500">
              Manage your personal information.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>

            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4">
              <User size={18} className="text-gray-400" />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3 outline-none text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4">
              <Mail size={18} className="text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 outline-none text-gray-700"
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
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500 outline-none"
            />
          </div>

        </div>

      </div>

      {/* Notification Settings */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <Bell size={23} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Notification Preferences
            </h2>

            <p className="text-sm text-gray-500">
              Choose which notifications you want to receive.
            </p>
          </div>
        </div>

        <div className="space-y-5">

          {[
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
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold text-gray-800">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
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

      </div>

      {/* Appearance Settings */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
            <Palette size={23} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Appearance
            </h2>

            <p className="text-sm text-gray-500">
              Choose your preferred application theme.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {["Light", "Dark"].map((item) => (
            <button
              key={item}
              onClick={() => setTheme(item)}
              className={`p-5 rounded-xl border-2 text-left transition ${
                theme === item
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`w-full h-16 rounded-lg mb-3 flex items-center justify-center ${
                item === "Light" ? "bg-gray-100" : "bg-gray-800"
              }`}>
                <Sprout
                  size={27}
                  className={item === "Light" ? "text-green-700" : "text-green-400"}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">
                  {item} Mode
                </span>

                {theme === item && (
                  <CheckCircle size={19} className="text-green-600" />
                )}
              </div>
            </button>
          ))}

        </div>

        <p className="text-xs text-gray-400 mt-3">
          Theme selection is a frontend preference demo. It does not currently change the whole application theme.
        </p>

      </div>

      {/* Security Settings */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-orange-100 text-orange-700 rounded-xl">
            <Shield size={23} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Security Settings
            </h2>

            <p className="text-sm text-gray-500">
              Account security information.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Lock size={22} className="text-gray-500" />

            <div>
              <h3 className="font-semibold text-gray-800">
                Password Protection
              </h3>

              <p className="text-sm text-gray-500">
                Your account uses password-based login.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-2 rounded-full">
            Enabled
          </span>
        </div>

      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

        {saved && (
          <p className="flex items-center gap-2 text-green-700 text-sm font-semibold">
            <CheckCircle size={18} />
            Settings saved for this session.
          </p>
        )}

        <button
          onClick={handleSave}
          className="sm:ml-auto w-full sm:w-auto flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-7 py-3 rounded-xl font-semibold transition"
        >
          <Save size={19} />
          Save Changes
        </button>

      </div>

      {/* Demo Note */}
      <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
        <Info className="text-yellow-700 shrink-0 mt-0.5" size={20} />

        <p className="text-sm text-yellow-800">
          Note: Settings are currently frontend demonstration features.
          Permanent profile, notification and security preferences will require backend integration.
        </p>
      </div>

    </div>
  );
}

export default Settings;
