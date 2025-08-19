import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Settings,
  Plus,
  FileText,
  Download,
  Save,
  Copy,
  Trash2
} from 'lucide-react'

interface CustomReportsProps {
  dateRange: string
}

const savedReports = [
  {
    id: '1',
    name: 'Weekly Family Update',
    description: 'Summary for grandparents with photos and milestones',
    sections: ['Growth summary', 'New photos', 'Milestones', 'Funny moments'],
    format: 'PDF',
    schedule: 'Weekly'
  },
  {
    id: '2',
    name: 'Daycare Report',
    description: 'Daily activities and behavior for daycare',
    sections: ['Sleep schedule', 'Meals', 'Activities', 'Mood'],
    format: 'PDF',
    schedule: 'Daily'
  },
  {
    id: '3',
    name: 'Doctor Visit Summary',
    description: 'Comprehensive health and growth for medical appointments',
    sections: ['Growth charts', 'Health metrics', 'Concerns', 'Questions'],
    format: 'PDF',
    schedule: 'Manual'
  }
]

export function CustomReports({ dateRange }: CustomReportsProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newReport, setNewReport] = useState({
    name: '',
    description: '',
    sections: [] as string[],
    format: 'PDF',
    schedule: 'Manual'
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Custom Reports</h2>
          <p className="text-sm text-muted-foreground">
            Create personalized reports tailored to your specific needs
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Report
        </Button>
      </div>

      {/* Create New Report */}
      {isCreating && (
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Create Custom Report</CardTitle>
            <CardDescription>Design a report template for your specific needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  placeholder="e.g., Monthly Grandparent Update"
                  value={newReport.name}
                  onChange={(e) => setNewReport({...newReport, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-format">Format</Label>
                <select
                  id="report-format"
                  value={newReport.format}
                  onChange={(e) => setNewReport({...newReport, format: e.target.value})}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
                >
                  <option value="PDF">PDF</option>
                  <option value="Excel">Excel</option>
                  <option value="CSV">CSV</option>
                  <option value="Email">Email Summary</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Textarea
                id="report-description"
                placeholder="Describe the purpose and audience for this report..."
                value={newReport.description}
                onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Report Sections</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  'Growth Summary', 'Health Records', 'Sleep Patterns', 'Meal Tracking',
                  'Activities', 'Milestones', 'Photos', 'Development Progress',
                  'Mood Tracking', 'Medication Log', 'Doctor Notes', 'Family Updates'
                ].map((section) => (
                  <label key={section} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newReport.sections.includes(section)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewReport({...newReport, sections: [...newReport.sections, section]})
                        } else {
                          setNewReport({...newReport, sections: newReport.sections.filter(s => s !== section)})
                        }
                      }}
                      className="rounded"
                    />
                    <span>{section}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Custom Reports */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Saved Report Templates</CardTitle>
          <CardDescription>Your custom report templates and quick actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savedReports.map((report) => (
              <Card key={report.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-foreground">{report.name}</h4>
                        <Badge variant="outline" className="text-xs">{report.format}</Badge>
                        <Badge variant="secondary" className="text-xs">{report.schedule}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {report.sections.map((section, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Builder Tools */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Advanced Report Tools</CardTitle>
          <CardDescription>Additional tools for data analysis and export</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-border hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Download className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium mb-1">Raw Data Export</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Export all data in CSV or Excel format
                </p>
                <Button size="sm" variant="outline">Export Data</Button>
              </CardContent>
            </Card>

            <Card className="border border-border hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-success mx-auto mb-2" />
                <h4 className="font-medium mb-1">Automated Reports</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Set up scheduled report generation
                </p>
                <Button size="sm" variant="outline">Configure</Button>
              </CardContent>
            </Card>

            <Card className="border border-border hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Settings className="w-8 h-8 text-warning mx-auto mb-2" />
                <h4 className="font-medium mb-1">Report Templates</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Import/export report templates
                </p>
                <Button size="sm" variant="outline">Manage</Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Insights</CardTitle>
          <CardDescription>AI-powered summary of Emma's recent patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="font-medium text-success mb-1">Sleep Quality Improving</div>
              <p className="text-sm text-muted-foreground">
                Emma's sleep duration has increased by 45 minutes over the past month, with fewer night wakings.
              </p>
            </div>
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="font-medium text-primary mb-1">Growth Milestone Alert</div>
              <p className="text-sm text-muted-foreground">
                Based on current growth rate, Emma may reach the 96th percentile for height next month.
              </p>
            </div>
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="font-medium text-warning mb-1">Activity Pattern Change</div>
              <p className="text-sm text-muted-foreground">
                Play time has increased by 20% this week, indicating higher energy levels and engagement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}