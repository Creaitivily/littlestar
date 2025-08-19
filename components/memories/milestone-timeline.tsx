import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import {
  Star,
  Calendar,
  Camera,
  Heart,
  Share,
  Plus,
  Baby,
  Footprints,
  MessageCircle,
  Utensils,
  BookOpen,
  Smile
} from 'lucide-react'

interface MilestoneTimelineProps {
  searchQuery: string
  filter: string
}

interface Milestone {
  id: string
  title: string
  description: string
  date: Date
  ageAtMilestone: string
  category: 'physical' | 'cognitive' | 'social' | 'language' | 'emotional'
  significance: 'major' | 'minor'
  photos: number
  videos: number
  notes: string
  sharedWith: string[]
  reactions: {
    hearts: number
    smiles: number
    surprises: number
  }
}

const milestones: Milestone[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Emma took her very first independent steps! She walked from the couch to daddy without any support.',
    date: new Date(2024, 7, 15),
    ageAtMilestone: '13 months',
    category: 'physical',
    significance: 'major',
    photos: 12,
    videos: 3,
    notes: 'Such an exciting day! She was so proud of herself and kept clapping. We called grandma and grandpa right away.',
    sharedWith: ['Grandma', 'Grandpa', 'Aunt Sarah', 'Uncle Mike'],
    reactions: { hearts: 23, smiles: 18, surprises: 8 }
  },
  {
    id: '2',
    title: 'First Word: "Mama"',
    description: 'Emma clearly said "mama" for the first time while looking directly at me.',
    date: new Date(2024, 6, 28),
    ageAtMilestone: '12 months 2 weeks',
    category: 'language',
    significance: 'major',
    photos: 5,
    videos: 2,
    notes: 'I cried happy tears! She had been babbling "ma ma ma" for weeks, but this was clearly intentional.',
    sharedWith: ['Daddy', 'Grandma', 'Grandpa'],
    reactions: { hearts: 34, smiles: 12, surprises: 5 }
  },
  {
    id: '3',
    title: 'Sleeping Through the Night',
    description: 'Emma slept for 11 hours straight without waking up - our first full night of sleep in months!',
    date: new Date(2024, 5, 10),
    ageAtMilestone: '11 months',
    category: 'physical',
    significance: 'major',
    photos: 1,
    videos: 0,
    notes: 'We actually woke up before her and were worried something was wrong! But she was just sleeping peacefully.',
    sharedWith: ['Daddy'],
    reactions: { hearts: 15, smiles: 20, surprises: 3 }
  },
  {
    id: '4',
    title: 'First Tooth',
    description: 'The bottom front tooth finally broke through after days of teething.',
    date: new Date(2024, 3, 22),
    ageAtMilestone: '8 months 3 weeks',
    category: 'physical',
    significance: 'minor',
    photos: 8,
    videos: 1,
    notes: 'So tiny and precious! She keeps running her tongue over it. The teething was rough but worth it for this little milestone.',
    sharedWith: ['Grandma', 'Aunt Sarah'],
    reactions: { hearts: 28, smiles: 15, surprises: 2 }
  },
  {
    id: '5',
    title: 'Sitting Independently',
    description: 'Emma can now sit up by herself without any support and play with toys.',
    date: new Date(2024, 1, 14),
    ageAtMilestone: '6 months 1 week',
    category: 'physical',
    significance: 'major',
    photos: 15,
    videos: 4,
    notes: 'Opens up a whole new world of play! She loves sitting and exploring toys with both hands.',
    sharedWith: ['Grandma', 'Grandpa', 'Daycare'],
    reactions: { hearts: 19, smiles: 25, surprises: 1 }
  },
  {
    id: '6',
    title: 'First Giggle',
    description: 'Emma had her first real belly laugh when daddy was playing peek-a-boo.',
    date: new Date(2023, 10, 8),
    ageAtMilestone: '3 months 2 weeks',
    category: 'social',
    significance: 'major',
    photos: 3,
    videos: 5,
    notes: 'The most beautiful sound in the world! She thought peek-a-boo was hilarious and kept giggling.',
    sharedWith: ['Everyone!'],
    reactions: { hearts: 45, smiles: 30, surprises: 12 }
  }
]

const categoryColors = {
  physical: 'from-success/20 to-success/40',
  cognitive: 'from-primary/20 to-primary/40',
  social: 'from-accent/20 to-accent/40',
  language: 'from-warning/20 to-warning/40',
  emotional: 'from-secondary/20 to-secondary/40'
}

const categoryIcons = {
  physical: Footprints,
  cognitive: BookOpen,
  social: Smile,
  language: MessageCircle,
  emotional: Heart
}

const significanceColors = {
  major: 'destructive',
  minor: 'secondary'
} as const

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const Icon = categoryIcons[milestone.category]
  
  return (
    <Card className="card-soft hover:card-soft-hover transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${categoryColors[milestone.category]}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span>{milestone.title}</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={significanceColors[milestone.significance]} className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                {milestone.significance} milestone
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {milestone.category}
              </Badge>
            </div>
          </div>
          <Button size="sm" variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date and Age */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(milestone.date)}</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Baby className="w-4 h-4" />
            <span>{milestone.ageAtMilestone}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground">{milestone.description}</p>

        {/* Media Count */}
        {(milestone.photos > 0 || milestone.videos > 0) && (
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {milestone.photos > 0 && (
              <div className="flex items-center space-x-1">
                <Camera className="w-4 h-4" />
                <span>{milestone.photos} photos</span>
              </div>
            )}
            {milestone.videos > 0 && (
              <div className="flex items-center space-x-1">
                <span>🎥</span>
                <span>{milestone.videos} videos</span>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {milestone.notes && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-sm">
              <span className="text-muted-foreground font-medium">Notes:</span>
              <p className="mt-1">{milestone.notes}</p>
            </div>
          </div>
        )}

        {/* Shared With */}
        {milestone.sharedWith.length > 0 && (
          <div>
            <div className="text-sm text-muted-foreground mb-2">Shared with:</div>
            <div className="flex flex-wrap gap-1">
              {milestone.sharedWith.map((person, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {person}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Reactions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span>{milestone.reactions.hearts}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Smile className="w-4 h-4 text-yellow-500" />
              <span>{milestone.reactions.smiles}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>😮</span>
              <span>{milestone.reactions.surprises}</span>
            </span>
          </div>
          <Button size="sm" variant="ghost">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function MilestoneTimeline({ searchQuery, filter }: MilestoneTimelineProps) {
  const filteredMilestones = milestones.filter(milestone => {
    const matchesSearch = searchQuery === '' || 
      milestone.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      milestone.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      milestone.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filter === 'all' ||
      (filter === 'milestones' && milestone.significance === 'major') ||
      (filter === 'recent' && (new Date().getTime() - milestone.date.getTime()) < 30 * 24 * 60 * 60 * 1000)
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Milestone Timeline</h2>
          <p className="text-sm text-muted-foreground">
            {filteredMilestones.length} milestones recorded
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(categoryColors).map(([category, colorClass]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons]
          const count = milestones.filter(m => m.category === category).length
          
          return (
            <Card key={category} className="p-3 text-center">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass} mx-auto mb-2 w-fit`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-bold text-foreground">{count}</div>
              <div className="text-xs text-muted-foreground capitalize">{category}</div>
            </Card>
          )
        })}
      </div>

      {/* Timeline */}
      {filteredMilestones.length > 0 ? (
        <div className="space-y-4">
          {filteredMilestones.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No milestones found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? `No milestones match your search for "${searchQuery}"`
              : "No milestones match the selected filter"
            }
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Milestone
          </Button>
        </Card>
      )}

      {/* Upcoming Milestones */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Expected Upcoming Milestones</CardTitle>
          <CardDescription>Based on Emma's age and development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium">Two-word phrases</div>
                  <div className="text-sm text-muted-foreground">Expected: 18-24 months</div>
                </div>
              </div>
              <Badge variant="warning" className="text-xs">Soon</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-success/40">
                  <Footprints className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium">Running confidently</div>
                  <div className="text-sm text-muted-foreground">Expected: 18-24 months</div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">Upcoming</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}