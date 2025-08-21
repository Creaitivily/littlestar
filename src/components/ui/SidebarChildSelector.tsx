import { ChevronDown, Plus, Baby, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './dropdown-menu'
import { useSidebar } from './sidebar'
import { format } from 'date-fns'

interface Child {
  id: string
  user_id: string
  name: string
  birth_date: string
  birth_time: string | null
  profile_image_url: string | null
  created_at: string
  updated_at: string
}

interface SidebarChildSelectorProps {
  children: Child[]
  selectedChild: Child | null
  onChildSelect: (child: Child) => void
  onAddChild: () => void
}

export function SidebarChildSelector({ 
  children, 
  selectedChild, 
  onChildSelect,
  onAddChild 
}: SidebarChildSelectorProps) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  
  const formatBirthDate = (birthDate: string) => {
    try {
      return format(new Date(birthDate), 'dd MMM yyyy')
    } catch {
      return 'Little Star'
    }
  }

  // If no children, show add child button directly
  if (children.length === 0) {
    if (isCollapsed) {
      return (
        <button 
          onClick={onAddChild}
          className="w-8 h-8 rounded-md border-2 border-dashed border-cream-300 dark:border-navy-600 hover:border-coral-400 dark:hover:border-coral-500 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-coral-500"
          title="Add Your First Child"
        >
          <Plus className="w-4 h-4 text-coral-600 dark:text-coral-400" />
        </button>
      )
    }
    
    return (
      <button 
        onClick={onAddChild}
        className="w-full flex items-center justify-start gap-3 h-auto py-3 px-2 border-2 border-dashed border-cream-300 dark:border-navy-600 hover:border-coral-400 dark:hover:border-coral-500 rounded-md focus:outline-none focus:ring-2 focus:ring-coral-500"
      >
        <div className="w-10 h-10 rounded-full bg-coral-100 dark:bg-coral-900/20 flex items-center justify-center">
          <Plus className="w-5 h-5 text-coral-600 dark:text-coral-400" />
        </div>
        <div className="text-left">
          <div className="font-medium text-navy-700 dark:text-cream-100">Add Your First Child</div>
          <div className="text-xs text-navy-500 dark:text-cream-300">Start tracking milestones</div>
        </div>
      </button>
    )
  }

  // If only one child, show it without dropdown
  if (children.length === 1) {
    const child = children[0]
    
    if (isCollapsed) {
      return (
        <div className="w-8 h-8 flex items-center justify-center" title={`${child.name} - ${formatBirthDate(child.birth_date)}`}>
          {child.profile_image_url ? (
            <img 
              src={child.profile_image_url} 
              alt={child.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-sage-300 dark:border-sage-600"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-sage-100 dark:bg-sage-900/20 flex items-center justify-center">
              <Baby className="w-4 h-4 text-sage-600 dark:text-sage-400" />
            </div>
          )}
        </div>
      )
    }
    
    return (
      <div className="w-full px-2">
        <div className="flex items-start gap-3 py-2">
          {child.profile_image_url ? (
            <img 
              src={child.profile_image_url} 
              alt={child.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-sage-300 dark:border-sage-600"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-sage-100 dark:bg-sage-900/20 flex items-center justify-center">
              <Baby className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-navy-700 dark:text-cream-100 truncate">{child.name}</div>
            <div className="text-xs text-navy-500 dark:text-cream-300 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatBirthDate(child.birth_date)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Multiple children - show dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isCollapsed ? (
          <button 
            className="w-8 h-8 rounded-md hover:bg-cream-100 dark:hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-coral-500 dark:focus:ring-coral-400 flex items-center justify-center"
            title={selectedChild ? `${selectedChild.name} - ${formatBirthDate(selectedChild.birth_date)}` : 'Select Child'}
          >
            {selectedChild?.profile_image_url ? (
              <img 
                src={selectedChild.profile_image_url} 
                alt={selectedChild.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-sage-300 dark:border-sage-600"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-sage-100 dark:bg-sage-900/20 flex items-center justify-center">
                <Baby className="w-4 h-4 text-sage-600 dark:text-sage-400" />
              </div>
            )}
          </button>
        ) : (
          <button className="w-full flex items-center justify-between h-auto py-2 px-2 rounded-md hover:bg-cream-100 dark:hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-coral-500 dark:focus:ring-coral-400">
            <div className="flex items-start gap-3">
              {selectedChild?.profile_image_url ? (
                <img 
                  src={selectedChild.profile_image_url} 
                  alt={selectedChild.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-sage-300 dark:border-sage-600"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-sage-100 dark:bg-sage-900/20 flex items-center justify-center">
                  <Baby className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                </div>
              )}
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-navy-700 dark:text-cream-100 truncate">
                  {selectedChild?.name || 'Select Child'}
                </div>
                <div className="text-xs text-navy-500 dark:text-cream-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {selectedChild ? formatBirthDate(selectedChild.birth_date) : 'Choose a profile'}
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-navy-500 dark:text-cream-400 flex-shrink-0" />
          </button>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="min-w-[240px]">
        {/* Child Profiles */}
        {children.map((child) => (
          <DropdownMenuItem
            key={child.id}
            onClick={() => onChildSelect(child)}
            className="p-3 cursor-pointer hover:bg-cream-100 dark:hover:bg-navy-700"
          >
            <div className="flex items-start gap-3 w-full">
              {child.profile_image_url ? (
                <img 
                  src={child.profile_image_url} 
                  alt={child.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-sage-300 dark:border-sage-600"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-sage-100 dark:bg-sage-900/20 flex items-center justify-center">
                  <Baby className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-navy-700 dark:text-cream-100 truncate">{child.name}</div>
                <div className="text-xs text-navy-500 dark:text-cream-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatBirthDate(child.birth_date)}
                </div>
              </div>
              {selectedChild?.id === child.id && (
                <div className="w-2 h-2 rounded-full bg-coral-500 mt-1" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Add Child Option */}
        <DropdownMenuItem
          onClick={onAddChild}
          className="p-3 cursor-pointer hover:bg-coral-50 dark:hover:bg-coral-900/20"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-full bg-coral-100 dark:bg-coral-900/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-coral-600 dark:text-coral-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-coral-600 dark:text-coral-400">Add Another Child</div>
              <div className="text-xs text-navy-500 dark:text-cream-300">Track multiple milestones</div>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}