import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  Utensils,
  Clock,
  Plus,
  Smile,
  Meh,
  Frown,
  Apple,
  Milk,
  Beef,
  Coffee
} from 'lucide-react'

interface MealsSectionProps {
  selectedDate: Date
}

interface Meal {
  id: string
  time: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'bottle'
  foods: string[]
  amount: string
  duration: string
  appetite: 'excellent' | 'good' | 'fair' | 'poor'
  mood: 'happy' | 'content' | 'fussy'
  notes?: string
}

const meals: Meal[] = [
  {
    id: '1',
    time: '7:00 AM',
    type: 'breakfast',
    foods: ['Oatmeal with banana', 'Whole milk'],
    amount: 'Full portion',
    duration: '25 minutes',
    appetite: 'excellent',
    mood: 'happy',
    notes: 'Loved the banana pieces!'
  },
  {
    id: '2',
    time: '11:00 AM',
    type: 'snack',
    foods: ['Apple slices', 'Cheese cubes'],
    amount: 'Half portion',
    duration: '15 minutes',
    appetite: 'good',
    mood: 'content'
  },
  {
    id: '3',
    time: '12:30 PM',
    type: 'lunch',
    foods: ['Chicken and rice', 'Steamed broccoli', 'Water'],
    amount: 'Most of it',
    duration: '30 minutes',
    appetite: 'good',
    mood: 'happy',
    notes: 'Not interested in broccoli today'
  },
  {
    id: '4',
    time: '3:00 PM',
    type: 'snack',
    foods: ['Crackers', 'Yogurt'],
    amount: 'Full portion',
    duration: '20 minutes',
    appetite: 'excellent',
    mood: 'happy'
  },
  {
    id: '5',
    time: '5:00 PM',
    type: 'dinner',
    foods: ['Pasta with tomato sauce', 'Green beans', 'Milk'],
    amount: 'Full portion',
    duration: '35 minutes',
    appetite: 'good',
    mood: 'content',
    notes: 'Ate all the pasta, some green beans'
  }
]

const weeklyNutrition = [
  { day: 'Mon', fruits: 3, vegetables: 2, protein: 2, dairy: 3, grains: 4 },
  { day: 'Tue', fruits: 2, vegetables: 3, protein: 3, dairy: 2, grains: 3 },
  { day: 'Wed', fruits: 4, vegetables: 2, protein: 2, dairy: 3, grains: 4 },
  { day: 'Thu', fruits: 3, vegetables: 4, protein: 3, dairy: 2, grains: 3 },
  { day: 'Fri', fruits: 2, vegetables: 3, protein: 2, dairy: 4, grains: 3 },
  { day: 'Sat', fruits: 3, vegetables: 2, protein: 3, dairy: 3, grains: 4 },
  { day: 'Sun', fruits: 3, vegetables: 3, protein: 2, dairy: 3, grains: 3 }
]

const mealTypeColors = {
  breakfast: 'from-warning/20 to-warning/40',
  lunch: 'from-success/20 to-success/40',
  dinner: 'from-primary/20 to-primary/40',
  snack: 'from-accent/20 to-accent/40',
  bottle: 'from-secondary/20 to-secondary/40'
}

const mealTypeIcons = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: Utensils,
  snack: Apple,
  bottle: Milk
}

const appetiteColors = {
  excellent: 'success',
  good: 'secondary',
  fair: 'warning',
  poor: 'destructive'
} as const

const moodIcons = {
  happy: { icon: Smile, color: 'text-success' },
  content: { icon: Meh, color: 'text-secondary' },
  fussy: { icon: Frown, color: 'text-destructive' }
}

function MealCard({ meal }: { meal: Meal }) {
  const Icon = mealTypeIcons[meal.type]
  const MoodIcon = moodIcons[meal.mood].icon
  const moodColor = moodIcons[meal.mood].color
  
  return (
    <Card className="card-soft hover:card-soft-hover transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${mealTypeColors[meal.type]}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="capitalize">{meal.type}</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{meal.time}</span>
              <Badge variant={appetiteColors[meal.appetite]} className="text-xs">
                {meal.appetite} appetite
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MoodIcon className={`w-5 h-5 ${moodColor}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Foods */}
        <div>
          <div className="text-sm text-muted-foreground mb-1">Foods:</div>
          <div className="flex flex-wrap gap-1">
            {meal.foods.map((food, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {food}
              </Badge>
            ))}
          </div>
        </div>

        {/* Amount and Duration */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Amount:</span> {meal.amount}
          </div>
          <div>
            <span className="text-muted-foreground">Duration:</span> {meal.duration}
          </div>
        </div>

        {/* Notes */}
        {meal.notes && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-sm">
              <span className="text-muted-foreground font-medium">Notes:</span>
              <p className="mt-1">{meal.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MealsSection({ selectedDate }: MealsSectionProps) {
  const [showAddMeal, setShowAddMeal] = useState(false)
  
  const totalMeals = meals.length
  const excellentAppetite = meals.filter(m => m.appetite === 'excellent').length
  const avgMealDuration = Math.round(
    meals.reduce((acc, meal) => {
      const minutes = parseInt(meal.duration.split(' ')[0])
      return acc + minutes
    }, 0) / meals.length
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Meals & Feeding</h2>
          <p className="text-sm text-muted-foreground">
            Track Emma's nutrition and eating patterns
          </p>
        </div>
        <Button onClick={() => setShowAddMeal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Log Meal
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center bg-gradient-to-br from-success/10 to-success/20 border-success/20">
          <div className="text-2xl font-bold text-foreground mb-1">{totalMeals}</div>
          <div className="text-sm text-muted-foreground">Total Meals Today</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
          <div className="text-2xl font-bold text-foreground mb-1">{excellentAppetite}</div>
          <div className="text-sm text-muted-foreground">Excellent Appetite</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <div className="text-2xl font-bold text-foreground mb-1">{avgMealDuration}m</div>
          <div className="text-sm text-muted-foreground">Avg. Meal Duration</div>
        </Card>
      </div>

      {/* Today's Meals */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Today's Meals</CardTitle>
          <CardDescription>
            {selectedDate.toLocaleDateString()} feeding schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Nutrition Chart */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weekly Nutrition Balance</CardTitle>
          <CardDescription>Food group intake over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyNutrition}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="fruits" stackId="a" fill="hsl(var(--success))" name="Fruits" />
                <Bar dataKey="vegetables" stackId="a" fill="hsl(var(--secondary))" name="Vegetables" />
                <Bar dataKey="protein" stackId="a" fill="hsl(var(--destructive))" name="Protein" />
                <Bar dataKey="dairy" stackId="a" fill="hsl(var(--primary))" name="Dairy" />
                <Bar dataKey="grains" stackId="a" fill="hsl(var(--warning))" name="Grains" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-sm">Fruits</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-sm">Vegetables</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-sm">Protein</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm">Dairy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-sm">Grains</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}