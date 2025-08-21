import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, Edit } from 'lucide-react'

export function Profile() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-navy-700 dark:text-cream-100">
          Profile
        </h1>
        <p className="text-navy-600 dark:text-cream-200">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-cream-50 border-cream-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-navy-700">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-navy-500" />
              <span className="text-navy-600">user@example.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-navy-500" />
              <span className="text-navy-600">Member since January 2024</span>
            </div>
            <Button className="w-full mt-4 bg-coral-500 hover:bg-coral-600 text-cream-50">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-sage-50 border-sage-200">
          <CardHeader>
            <CardTitle className="text-navy-700">Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-24 h-24 rounded-full bg-sage-200 flex items-center justify-center mx-auto">
              <User className="w-12 h-12 text-sage-600" />
            </div>
            <Button variant="outline" className="w-full">
              Upload New Picture
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}