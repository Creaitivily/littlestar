import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Star, Check, Crown } from 'lucide-react'

export function Subscriptions() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-navy-700 dark:text-cream-100">
          Subscriptions
        </h1>
        <p className="text-navy-600 dark:text-cream-200">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card className="bg-coral-50 border-coral-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-navy-700">
            <Crown className="w-5 h-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-navy-700">Free Plan</h3>
              <p className="text-navy-600">Track up to 1 child</p>
            </div>
            <Badge variant="secondary" className="bg-sage-100 text-sage-700">
              Active
            </Badge>
          </div>
          <div className="pt-4">
            <Button className="bg-coral-500 hover:bg-coral-600 text-cream-50">
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-cream-50 border-cream-200">
          <CardHeader>
            <CardTitle className="text-navy-700">Premium Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-navy-700">
              $9.99<span className="text-base font-normal">/month</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-600" />
                <span className="text-navy-600">Track unlimited children</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-600" />
                <span className="text-navy-600">Advanced analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-600" />
                <span className="text-navy-600">Export data</span>
              </li>
            </ul>
            <Button className="w-full bg-coral-500 hover:bg-coral-600 text-cream-50">
              <Star className="w-4 h-4 mr-2" />
              Choose Premium
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-peach-50 border-peach-200">
          <CardHeader>
            <CardTitle className="text-navy-700">Family Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-navy-700">
              $19.99<span className="text-base font-normal">/month</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-600" />
                <span className="text-navy-600">Everything in Premium</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-600" />
                <span className="text-navy-600">Share with partner</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-600" />
                <span className="text-navy-600">Priority support</span>
              </li>
            </ul>
            <Button className="w-full bg-coral-500 hover:bg-coral-600 text-cream-50">
              <Crown className="w-4 h-4 mr-2" />
              Choose Family
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Billing Information */}
      <Card className="bg-sage-50 border-sage-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-navy-700">
            <CreditCard className="w-5 h-5" />
            Billing Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-navy-600">No payment method on file</p>
          <Button variant="outline">
            Add Payment Method
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}