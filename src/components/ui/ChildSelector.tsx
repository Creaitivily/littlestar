import React from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'

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

interface ChildSelectorProps {
  children: Child[]
  selectedChild: Child | null
  onChildSelect: (child: Child) => void
}

export function ChildSelector({ children, selectedChild, onChildSelect }: ChildSelectorProps) {
  if (children.length === 0) {
    return null
  }

  if (children.length === 1) {
    const child = children[0]
    return (
      <div className="flex items-center gap-3 bg-lavender-50 rounded-lg p-4 border border-lavender-200">
        {child.profile_image_url ? (
          <img 
            src={child.profile_image_url} 
            alt={child.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-lavender-300"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-lavender-100 flex items-center justify-center border-2 border-lavender-300">
            <span className="text-2xl">👶</span>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-800">{child.name}</h3>
          <p className="text-sm text-gray-600">
            {child.birth_date ? 
              `Born ${new Date(child.birth_date).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}` : 
              'Little Star'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-auto p-4 bg-lavender-50 border-lavender-200 hover:bg-lavender-100">
          <div className="flex items-center gap-3">
            {selectedChild?.profile_image_url ? (
              <img 
                src={selectedChild.profile_image_url} 
                alt={selectedChild.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-lavender-300"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-lavender-100 flex items-center justify-center border-2 border-lavender-300">
                <span className="text-2xl">👶</span>
              </div>
            )}
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">{selectedChild?.name || 'Select Child'}</h3>
              <p className="text-sm text-gray-600">
                {selectedChild?.birth_date ? 
                  `Born ${new Date(selectedChild.birth_date).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  })}` : 
                  'Choose which child to view'
                }
              </p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        {children.map((child) => (
          <DropdownMenuItem
            key={child.id}
            onClick={() => onChildSelect(child)}
            className="p-4 cursor-pointer hover:bg-lavender-50"
          >
            <div className="flex items-center gap-3 w-full">
              {child.profile_image_url ? (
                <img 
                  src={child.profile_image_url} 
                  alt={child.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-lavender-300"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center border-2 border-lavender-300">
                  <span className="text-xl">👶</span>
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-800">{child.name}</h4>
                <p className="text-sm text-gray-600">
                  {child.birth_date ? 
                    `Born ${new Date(child.birth_date).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}` : 
                    'Little Star'
                  }
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}