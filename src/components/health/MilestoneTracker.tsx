import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { healthDataService, type DevelopmentalMilestone } from '@/lib/healthDataService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Brain, CheckCircle, Clock, Plus, AlertTriangle, Target, Smile } from 'lucide-react'

// CDC Developmental Milestones Data
const CDC_MILESTONES = {
  2: [
    { category: 'social', name: 'Begins to smile at people', description: 'Shows social smiles' },
    { category: 'language', name: 'Can briefly calm himself', description: 'May bring hands to mouth' },
    { category: 'cognitive', name: 'Pays attention to faces', description: 'Looks at faces with interest' },
    { category: 'motor', name: 'Can hold head up', description: 'Holds head up when lying on tummy' }
  ],
  4: [
    { category: 'social', name: 'Smiles spontaneously', description: 'Especially at people' },
    { category: 'language', name: 'Begins to babble', description: 'Makes sounds back when you talk' },
    { category: 'cognitive', name: 'Lets you know if happy or sad', description: 'Shows emotions clearly' },
    { category: 'motor', name: 'Holds head steady', description: 'Unsupported head control' }
  ],
  6: [
    { category: 'social', name: 'Knows familiar faces', description: 'Recognizes familiar people' },
    { category: 'language', name: 'Responds to sounds', description: 'Makes sounds back' },
    { category: 'cognitive', name: 'Shows curiosity', description: 'Looks around at things nearby' },
    { category: 'motor', name: 'Rolls over', description: 'Rolls over in both directions' }
  ],
  9: [
    { category: 'social', name: 'May be afraid of strangers', description: 'Shows stranger anxiety' },
    { category: 'language', name: 'Understands "no"', description: 'Responds to simple commands' },
    { category: 'cognitive', name: 'Copies sounds and gestures', description: 'Imitates others' },
    { category: 'motor', name: 'Sits without support', description: 'Sits up independently' }
  ],
  12: [
    { category: 'social', name: 'Plays games like peek-a-boo', description: 'Enjoys interactive games' },
    { category: 'language', name: 'Says "mama" and "dada"', description: 'First meaningful words' },
    { category: 'cognitive', name: 'Explores things in different ways', description: 'Shaking, banging, throwing' },
    { category: 'motor', name: 'May take a few steps', description: 'Beginning to walk' }
  ],
  15: [
    { category: 'social', name: 'Shows affection to familiar people', description: 'Gives hugs and kisses' },
    { category: 'language', name: 'Says several single words', description: '3-5 clear words' },
    { category: 'cognitive', name: 'Shows interest in picture books', description: 'Looks at books with you' },
    { category: 'motor', name: 'Walks alone', description: 'Independent walking' }
  ],
  18: [
    { category: 'social', name: 'Likes to hand things to others', description: 'Enjoys sharing objects' },
    { category: 'language', name: 'Says at least 10 words', description: 'Growing vocabulary' },
    { category: 'cognitive', name: 'Points to show something interesting', description: 'Uses pointing to communicate' },
    { category: 'motor', name: 'Walks up steps', description: 'Can climb stairs with help' }
  ],
  24: [
    { category: 'social', name: 'Copies others, especially adults', description: 'Imitates daily activities' },
    { category: 'language', name: 'Points to things when named', description: 'Follows simple directions' },
    { category: 'cognitive', name: 'Finds things even when hidden', description: 'Object permanence developed' },
    { category: 'motor', name: 'Stands on tiptoe', description: 'Improved balance and coordination' }
  ],
  30: [
    { category: 'social', name: 'Shows defiant behavior', description: 'Says "no" and shows independence' },
    { category: 'language', name: 'Uses 2-word phrases', description: '"Want more", "Go bye-bye"' },
    { category: 'cognitive', name: 'Follows two-step instructions', description: '"Pick up toy and put in box"' },
    { category: 'motor', name: 'Jumps in place', description: 'Both feet leave ground' }
  ],
  36: [
    { category: 'social', name: 'Shows concern for crying friend', description: 'Developing empathy' },
    { category: 'language', name: 'Uses 3-word sentences', description: 'More complex language' },
    { category: 'cognitive', name: 'Can work toys with parts', description: 'Buttons, levers, moving parts' },
    { category: 'motor', name: 'Climbs well', description: 'Confident climbing' }
  ]
}

const MILESTONE_CATEGORIES = [
  { id: 'social', name: 'Social & Emotional', icon: Smile, color: 'bg-pink-100 text-pink-800' },
  { id: 'language', name: 'Language & Communication', icon: Brain, color: 'bg-blue-100 text-blue-800' },
  { id: 'cognitive', name: 'Cognitive', icon: Target, color: 'bg-purple-100 text-purple-800' },
  { id: 'motor', name: 'Physical Development', icon: CheckCircle, color: 'bg-green-100 text-green-800' }
]

interface MilestoneTrackerProps {
  childId: string
}

export function MilestoneTracker({ childId }: MilestoneTrackerProps) {
  const { user, children: childrenData } = useAuth()
  const [milestones, setMilestones] = useState<DevelopmentalMilestone[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadMilestoneData()
  }, [childId])

  const loadMilestoneData = async () => {
    if (!childId) return

    setLoading(true)
    try {
      const milestoneRecords = await healthDataService.getMilestones(childId)
      setMilestones(milestoneRecords)

      // Auto-populate standard CDC milestones if none exist
      if (milestoneRecords.length === 0) {
        await populateStandardMilestones()
      }
    } catch (error) {
      console.error('Error loading milestone data:', error)
    } finally {
      setLoading(false)
    }
  }

  const populateStandardMilestones = async () => {
    if (!user || !childId) return

    try {
      const currentChild = getCurrentChild()
      if (!currentChild) return

      const ageMonths = calculateAgeInMonths(currentChild.birth_date)
      const relevantAges = Object.keys(CDC_MILESTONES).map(Number).filter(age => age <= ageMonths + 6) // Include future milestones within 6 months

      for (const age of relevantAges) {
        const ageMillstones = CDC_MILESTONES[age as keyof typeof CDC_MILESTONES]
        for (const milestone of ageMillstones) {
          const milestoneRecord: Omit<DevelopmentalMilestone, 'id'> = {
            user_id: user.id,
            daughter_id: childId,
            milestone_category: milestone.category as 'motor' | 'language' | 'cognitive' | 'social',
            milestone_name: milestone.name,
            age_months_expected: age,
            age_months_achieved: null,
            achieved: false,
            achieved_date: null,
            notes: milestone.description,
            source: 'CDC'
          }

          await healthDataService.createMilestone(milestoneRecord)
        }
      }

      // Reload data
      await loadMilestoneData()
    } catch (error) {
      console.error('Error populating standard milestones:', error)
    }
  }

  const updateMilestone = async (milestoneId: string, achieved: boolean, achievedDate?: string) => {
    try {
      const currentChild = getCurrentChild()
      if (!currentChild) return

      const updates: Partial<DevelopmentalMilestone> = {
        achieved,
        achieved_date: achieved ? (achievedDate || new Date().toISOString().split('T')[0]) : null,
        age_months_achieved: achieved ? calculateAgeInMonths(currentChild.birth_date, achievedDate) : null
      }

      await healthDataService.updateMilestone(milestoneId, updates)
      await loadMilestoneData()
    } catch (error) {
      console.error('Error updating milestone:', error)
    }
  }

  const getCurrentChild = () => {
    return childrenData.find(child => child.id === childId)
  }

  const calculateAgeInMonths = (birthDate: string, referenceDate?: string) => {
    const birth = new Date(birthDate)
    const reference = referenceDate ? new Date(referenceDate) : new Date()
    return (reference.getFullYear() - birth.getFullYear()) * 12 + (reference.getMonth() - birth.getMonth())
  }

  const getMilestoneProgress = () => {
    const currentChild = getCurrentChild()
    if (!currentChild) return { byCategory: {}, overall: { achieved: 0, total: 0, percentage: 0 } }

    const ageMonths = calculateAgeInMonths(currentChild.birth_date)
    const expectedMilestones = milestones.filter(m => m.age_months_expected <= ageMonths)
    const achievedMilestones = expectedMilestones.filter(m => m.achieved)

    const byCategory: Record<string, { achieved: number, total: number, percentage: number }> = {}
    
    MILESTONE_CATEGORIES.forEach(cat => {
      const categoryExpected = expectedMilestones.filter(m => m.milestone_category === cat.id)
      const categoryAchieved = categoryExpected.filter(m => m.achieved)
      
      byCategory[cat.id] = {
        achieved: categoryAchieved.length,
        total: categoryExpected.length,
        percentage: categoryExpected.length > 0 ? (categoryAchieved.length / categoryExpected.length) * 100 : 0
      }
    })

    return {
      byCategory,
      overall: {
        achieved: achievedMilestones.length,
        total: expectedMilestones.length,
        percentage: expectedMilestones.length > 0 ? (achievedMilestones.length / expectedMilestones.length) * 100 : 0
      }
    }
  }

  const getFilteredMilestones = () => {
    return selectedCategory === 'all' 
      ? milestones 
      : milestones.filter(m => m.milestone_category === selectedCategory)
  }

  const getMilestonesByAge = () => {
    const filtered = getFilteredMilestones()
    const byAge: Record<number, DevelopmentalMilestone[]> = {}
    
    filtered.forEach(milestone => {
      if (!byAge[milestone.age_months_expected]) {
        byAge[milestone.age_months_expected] = []
      }
      byAge[milestone.age_months_expected].push(milestone)
    })

    return byAge
  }

  const currentChild = getCurrentChild()
  if (!currentChild) return <div>Loading...</div>

  const progress = getMilestoneProgress()
  const milestonesByAge = getMilestonesByAge()
  const currentAge = calculateAgeInMonths(currentChild.birth_date)

  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading developmental milestones...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Developmental Milestones</h2>
          <p className="text-gray-600">
            CDC milestones for {currentChild.name} • {Math.floor(currentAge / 12)}y {currentAge % 12}m old
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Development Progress
          </CardTitle>
          <CardDescription>
            Overall milestone achievement for {currentChild.name}'s age
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span>{progress.overall.achieved}/{progress.overall.total} milestones</span>
              </div>
              <Progress value={progress.overall.percentage} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">
                {progress.overall.percentage.toFixed(0)}% of age-appropriate milestones achieved
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {MILESTONE_CATEGORIES.map(category => {
                const categoryProgress = progress.byCategory[category.id] || { achieved: 0, total: 0, percentage: 0 }
                const Icon = category.icon
                
                return (
                  <div key={category.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <Progress value={categoryProgress.percentage} className="h-1.5 mb-1" />
                    <div className="text-xs text-gray-600">
                      {categoryProgress.achieved}/{categoryProgress.total} achieved
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex items-center space-x-2">
        <Label>Filter by category:</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {MILESTONE_CATEGORIES.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Milestones by Age */}
      <div className="space-y-4">
        {Object.keys(milestonesByAge)
          .map(Number)
          .sort((a, b) => a - b)
          .map(age => {
            const ageMilestones = milestonesByAge[age]
            const isCurrentAge = Math.abs(age - currentAge) <= 1
            const isPastDue = age < currentAge - 2
            
            return (
              <Card key={age} className={`${isCurrentAge ? 'ring-2 ring-blue-200' : ''} ${isPastDue ? 'border-orange-200' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {age} Month{age !== 1 ? 's' : ''} Old
                      {isCurrentAge && <Badge className="ml-2">Current Age</Badge>}
                      {isPastDue && <Badge variant="outline" className="ml-2 text-orange-600">Review</Badge>}
                    </span>
                    <div className="text-sm text-gray-600">
                      {ageMilestones.filter(m => m.achieved).length}/{ageMilestones.length} achieved
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {ageMilestones.map(milestone => {
                      const category = MILESTONE_CATEGORIES.find(cat => cat.id === milestone.milestone_category)
                      const Icon = category?.icon || CheckCircle
                      
                      return (
                        <div key={milestone.id} className={`flex items-start space-x-3 p-3 rounded-lg border ${
                          milestone.achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <Checkbox
                            checked={milestone.achieved}
                            onCheckedChange={(checked) => 
                              updateMilestone(milestone.id!, checked as boolean)
                            }
                            className="mt-1"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Icon className="h-4 w-4 text-gray-600" />
                              <span className={`font-medium ${milestone.achieved ? 'text-green-800' : 'text-gray-800'}`}>
                                {milestone.milestone_name}
                              </span>
                              <Badge variant="outline" className={category?.color}>
                                {category?.name}
                              </Badge>
                            </div>
                            
                            {milestone.notes && (
                              <p className="text-sm text-gray-600 mb-2">{milestone.notes}</p>
                            )}
                            
                            {milestone.achieved && milestone.achieved_date && (
                              <div className="flex items-center text-sm text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Achieved on {new Date(milestone.achieved_date).toLocaleDateString()}
                                {milestone.age_months_achieved && (
                                  <span className="ml-2">
                                    at {milestone.age_months_achieved} months
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {!milestone.achieved && age < currentAge - 2 && (
                            <AlertTriangle className="h-4 w-4 text-orange-500 mt-1" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>

      {milestones.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No milestones tracked yet</p>
            <p className="text-sm text-gray-500 mb-4">
              We'll automatically add CDC developmental milestones for your child's age
            </p>
            <Button onClick={populateStandardMilestones}>
              Add Standard Milestones
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}