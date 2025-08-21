import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Shield, Palette, Globe, Download, MapPin } from 'lucide-react'
import { useUserSettings } from '@/hooks/useUserSettings'
import { countries } from '@/lib/countries'

export function Settings() {
  const { settings, loading, updateSetting } = useUserSettings()

  const handleToggle = async (key: keyof typeof settings, value: boolean) => {
    await updateSetting(key, value)
  }

  const handleCountryChange = async (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode)
    if (country) {
      await updateSetting('country', countryCode)
      // Filter out undefined values
      const cleanEmergencyNumbers = Object.fromEntries(
        Object.entries(country.emergencyNumbers).filter(([_, value]) => value !== undefined)
      ) as Record<string, string>
      await updateSetting('emergency_contact_numbers', cleanEmergencyNumbers)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-navy-700 dark:text-cream-100">Settings</h1>
          <p className="text-navy-600 dark:text-cream-200">Loading your preferences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-navy-700 dark:text-cream-100">
          Settings
        </h1>
        <p className="text-navy-600 dark:text-cream-200">
          Customize your MilestoneBee experience
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Notifications */}
        <Card className="bg-cream-50 border-cream-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-navy-700">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-navy-600 font-medium">Milestone reminders</span>
                <p className="text-sm text-navy-500">Get notified about upcoming milestones</p>
              </div>
              <Switch 
                checked={settings.milestone_reminders}
                onCheckedChange={(checked) => handleToggle('milestone_reminders', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-navy-600 font-medium">Weekly summaries</span>
                <p className="text-sm text-navy-500">Weekly progress reports via email</p>
              </div>
              <Switch 
                checked={settings.weekly_summaries}
                onCheckedChange={(checked) => handleToggle('weekly_summaries', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-navy-600 font-medium">App updates</span>
                <p className="text-sm text-navy-500">Notifications about new features</p>
              </div>
              <Switch 
                checked={settings.app_updates}
                onCheckedChange={(checked) => handleToggle('app_updates', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-navy-600 font-medium">Email notifications</span>
                <p className="text-sm text-navy-500">Receive notifications via email</p>
              </div>
              <Switch 
                checked={settings.email_notifications}
                onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="bg-sage-50 border-sage-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-navy-700">
              <Shield className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-navy-600 font-medium">Two-factor authentication</span>
                <p className="text-sm text-navy-500">Add extra security to your account</p>
              </div>
              <Switch 
                checked={settings.two_factor_enabled}
                onCheckedChange={(checked) => handleToggle('two_factor_enabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-navy-600 font-medium">Data encryption</span>
                <p className="text-sm text-navy-500">Encrypt all sensitive data</p>
              </div>
              <Switch 
                checked={settings.data_encryption_enabled}
                onCheckedChange={(checked) => handleToggle('data_encryption_enabled', checked)}
                disabled
              />
            </div>
            <div className="text-xs text-navy-500 bg-sage-100 p-2 rounded">
              <Shield className="w-3 h-3 inline mr-1" />
              Data encryption is required and cannot be disabled for security compliance.
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-peach-50 border-peach-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-navy-700">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-navy-600 font-medium">Theme</label>
              <Select 
                value={settings.theme} 
                onValueChange={(value: 'light' | 'dark' | 'auto') => updateSetting('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-navy-600 font-medium">Color scheme</label>
              <Select 
                value={settings.color_scheme} 
                onValueChange={(value) => updateSetting('color_scheme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="milestonebee">MilestoneBee</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card className="bg-coral-50 border-coral-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-navy-700">
              <Globe className="w-5 h-5" />
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-navy-600 font-medium">Language</label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => updateSetting('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-navy-600 font-medium">Date format</label>
              <Select 
                value={settings.date_format} 
                onValueChange={(value) => updateSetting('date_format', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (UK)</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-navy-600 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Country
              </label>
              <Select 
                value={settings.country} 
                onValueChange={handleCountryChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-navy-500">
                Used for emergency numbers and regional features
              </p>
            </div>
            {settings.emergency_contact_numbers && Object.keys(settings.emergency_contact_numbers).length > 0 && (
              <div className="bg-coral-100 p-3 rounded-lg">
                <h4 className="font-medium text-coral-700 mb-2">Emergency Numbers</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(settings.emergency_contact_numbers).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize text-coral-600">{key.replace('_', ' ')}</span>
                      <span className="font-mono text-coral-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card className="bg-navy-50 border-navy-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-navy-700">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline">
              Export Data
            </Button>
            <Button variant="outline">
              Import Data
            </Button>
            <Button variant="destructive">
              Delete Account
            </Button>
          </div>
          <p className="text-xs text-navy-500 mt-4">
            Export your data in JSON format or permanently delete your account and all associated data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}