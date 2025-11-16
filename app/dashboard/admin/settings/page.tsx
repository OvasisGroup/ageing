'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';
import toast from 'react-hot-toast';

type SettingsSection = 'general' | 'security' | 'notifications' | 'appearance' | 'advanced';

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [loading, setLoading] = useState(false);

  // General Settings
  const [siteName, setSiteName] = useState('Senior Home Services Network');
  const [siteDescription, setSiteDescription] = useState('Aging Care Platform');
  const [contactEmail, setContactEmail] = useState('admin@mynestshield.com');
  const [supportPhone, setSupportPhone] = useState('+1 (555) 123-4567');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordMinLength, setPasswordMinLength] = useState('8');
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newUserAlerts, setNewUserAlerts] = useState(true);
  const [newInquiryAlerts, setNewInquiryAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  // Appearance Settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [primaryColor, setPrimaryColor] = useState('#0066cc');
  const [showBranding, setShowBranding] = useState(true);

  // Advanced Settings
  const [debugMode, setDebugMode] = useState(false);
  const [apiRateLimit, setApiRateLimit] = useState('100');
  const [dataRetentionDays, setDataRetentionDays] = useState('365');
  const [enableAnalytics, setEnableAnalytics] = useState(true);

  const handleSaveSettings = async (section: SettingsSection) => {
    setLoading(true);
    const loadingToast = toast.loading(`Saving ${section} settings...`);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`, {
        id: loadingToast,
      });
    } catch {
      toast.error('Failed to save settings', {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'advanced', name: 'Advanced', icon: '🔧' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your platform settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as SettingsSection)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span className="font-medium">{section.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border border-border">
              {/* General Settings */}
              {activeSection === 'general' && (
                <div>
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">General Settings</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure basic platform settings
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={siteDescription}
                        onChange={(e) => setSiteDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Support Phone
                      </label>
                      <input
                        type="tel"
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div>
                        <h3 className="font-medium">Maintenance Mode</h3>
                        <p className="text-sm text-muted-foreground">
                          Disable public access to the platform
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={maintenanceMode}
                          onChange={(e) => setMaintenanceMode(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={() => handleSaveSettings('general')}
                        disabled={loading}
                      >
                        Save General Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div>
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Security Settings</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage security and authentication options
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">
                          Require 2FA for all admin users
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={twoFactorAuth}
                          onChange={(e) => setTwoFactorAuth(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Minimum Password Length
                      </label>
                      <input
                        type="number"
                        value={passwordMinLength}
                        onChange={(e) => setPasswordMinLength(e.target.value)}
                        min="6"
                        max="20"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div>
                        <h3 className="font-medium">Require Special Characters</h3>
                        <p className="text-sm text-muted-foreground">
                          Passwords must include special characters
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={requireSpecialChars}
                          onChange={(e) => setRequireSpecialChars(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={maxLoginAttempts}
                        onChange={(e) => setMaxLoginAttempts(e.target.value)}
                        min="3"
                        max="10"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={() => handleSaveSettings('security')}
                        disabled={loading}
                      >
                        Save Security Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div>
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Notification Settings</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure notification preferences
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Notification Channels</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via email
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={emailNotifications}
                              onChange={(e) => setEmailNotifications(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                          <div>
                            <h4 className="font-medium">SMS Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via SMS
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={smsNotifications}
                              onChange={(e) => setSmsNotifications(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                          <div>
                            <h4 className="font-medium">Push Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive push notifications in browser
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={pushNotifications}
                              onChange={(e) => setPushNotifications(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Alert Types</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                          <div>
                            <h4 className="font-medium">New User Registrations</h4>
                            <p className="text-sm text-muted-foreground">
                              Get notified when new users register
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newUserAlerts}
                              onChange={(e) => setNewUserAlerts(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                          <div>
                            <h4 className="font-medium">New Inquiries</h4>
                            <p className="text-sm text-muted-foreground">
                              Get notified about new inquiry submissions
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newInquiryAlerts}
                              onChange={(e) => setNewInquiryAlerts(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                          <div>
                            <h4 className="font-medium">System Alerts</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive critical system notifications
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={systemAlerts}
                              onChange={(e) => setSystemAlerts(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={() => handleSaveSettings('notifications')}
                        disabled={loading}
                      >
                        Save Notification Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeSection === 'appearance' && (
                <div>
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Appearance Settings</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Customize the look and feel of your platform
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Theme
                      </label>
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'auto')}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="h-10 w-20 border border-border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div>
                        <h3 className="font-medium">Show Branding</h3>
                        <p className="text-sm text-muted-foreground">
                          Display platform branding and logos
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showBranding}
                          onChange={(e) => setShowBranding(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={() => handleSaveSettings('appearance')}
                        disabled={loading}
                      >
                        Save Appearance Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              {activeSection === 'advanced' && (
                <div>
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Advanced Settings</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Advanced configuration options for developers
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div>
                        <h3 className="font-medium">Debug Mode</h3>
                        <p className="text-sm text-muted-foreground">
                          Enable detailed error logging
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={debugMode}
                          onChange={(e) => setDebugMode(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        API Rate Limit (requests/minute)
                      </label>
                      <input
                        type="number"
                        value={apiRateLimit}
                        onChange={(e) => setApiRateLimit(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Data Retention Period (days)
                      </label>
                      <input
                        type="number"
                        value={dataRetentionDays}
                        onChange={(e) => setDataRetentionDays(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div>
                        <h3 className="font-medium">Enable Analytics</h3>
                        <p className="text-sm text-muted-foreground">
                          Track user behavior and platform usage
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableAnalytics}
                          onChange={(e) => setEnableAnalytics(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-900 mb-2">⚠️ Danger Zone</h4>
                      <p className="text-sm text-yellow-800 mb-4">
                        These actions cannot be undone. Please proceed with caution.
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full text-left justify-start">
                          Clear Cache
                        </Button>
                        <Button variant="outline" className="w-full text-left justify-start">
                          Reset All Settings
                        </Button>
                        <Button variant="destructive" className="w-full">
                          Delete All Data
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={() => handleSaveSettings('advanced')}
                        disabled={loading}
                      >
                        Save Advanced Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}