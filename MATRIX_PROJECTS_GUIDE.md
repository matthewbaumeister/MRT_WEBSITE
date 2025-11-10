# MATRIX Projects Feature Guide

## Overview
The Projects feature allows you to organize your MATRIX chats into projects for better organization and workflow management.

## What You Can Do

### 1. Create Projects
- Click "Projects" in the sidebar to expand the projects section
- Click "+ New Project" to create a new project
- Give it a name (e.g., "Marketing Campaign 2024")
- Add an optional description
- Choose a color for visual organization (8 colors available)

### 2. View All Projects
- Projects appear in the collapsible sidebar section
- Each project shows its colored dot indicator
- Projects are sorted by most recently updated

### 3. Filter Chats by Project
- Click "All Chats" to see everything
- Click any project name to filter chats to that project only
- Active project shows highlighted in the sidebar
- "Project Active" indicator appears in chat header

### 4. Delete Projects
- Click the trash icon next to any project
- Confirmation dialog prevents accidents
- Chats are NOT deleted, only unlinked from the project

## Color Options
Choose from 8 colors to organize your projects:
- **Purple** (#2F2F72) - Brand color, default
- **Gold** (#D4AF37) - Brand accent
- **Blue** (#3B82F6) - Cool, professional
- **Green** (#10B981) - Success, growth
- **Red** (#EF4444) - Urgent, important
- **Orange** (#F59E0B) - Creative, warm
- **Pink** (#EC4899) - Fun, creative
- **Cyan** (#06B6D4) - Tech, modern

## Use Cases

### By Department
- Marketing Projects (Gold)
- Engineering Projects (Blue)
- Sales Projects (Green)
- Support Projects (Cyan)

### By Client
- Client A - Product Launch (Purple)
- Client B - Research (Blue)
- Client C - Strategy (Orange)

### By Phase
- Planning & Research (Blue)
- Active Development (Green)
- Review & Approval (Orange)
- Completed (Purple)

### By Priority
- Urgent (Red)
- High Priority (Orange)
- Medium Priority (Gold)
- Low Priority (Green)

## How It Works

### Current Implementation
1. **Project Creation**: Projects are stored in Supabase with full RLS security
2. **Visual Organization**: Color-coded dots help you quickly identify projects
3. **Filtering**: Select a project to focus only on those chats
4. **Persistence**: Your projects are saved per user account

### Future Enhancements (Coming Soon)
1. **Chat Assignment**: Assign chats to projects when creating them
2. **Project Documents**: Upload documents specific to each project
3. **Shared Context**: All chats in a project can reference project documents
4. **Team Collaboration**: Share projects with team members
5. **Project Analytics**: See usage stats per project
6. **Project Archives**: Archive completed projects
7. **Project Templates**: Quick-start with pre-configured projects

## Database Setup

### Required SQL (Run in Supabase SQL Editor)
```sql
-- Located in: SUPABASE_MATRIX_PROJECTS.sql
```

This creates:
- `matrix_projects` table for storing projects
- `project_id` column in conversations
- Indexes for performance
- RLS policies for security
- Triggers for auto-updating timestamps

## API Endpoints

### GET /api/matrix/projects
- Lists all projects for the current user
- Sorted by most recently updated

### POST /api/matrix/projects
- Creates a new project
- Required: `name`
- Optional: `description`, `color`

### PUT /api/matrix/projects
- Updates an existing project
- Required: `id`
- Optional: `name`, `description`, `color`

### DELETE /api/matrix/projects?id={projectId}
- Deletes a project
- Chats remain but are unlinked

## Technical Details

### Security
- Full Row Level Security (RLS) enabled
- Users can only see/edit their own projects
- Project deletion requires confirmation
- All API calls validate user session

### Performance
- Indexed on user_id for fast loading
- Indexed on updated_at for sorting
- Auto-updates timestamps on chat activity

### Data Structure
```typescript
interface Project {
  id: string;              // UUID
  user_id: string;         // UUID reference
  name: string;            // Project name
  description?: string;    // Optional description
  color: string;           // Hex color code
  created_at: string;      // ISO timestamp
  updated_at: string;      // ISO timestamp
}
```

## Tips for Organization

1. **Use Colors Consistently**: Pick a color scheme and stick to it
2. **Keep Names Short**: They show in the sidebar, keep them concise
3. **Add Descriptions**: Helps you remember project details later
4. **Regular Cleanup**: Delete old projects you no longer need
5. **Start with All Chats**: Create projects as you need them

## Keyboard Shortcuts (Future)
- `Cmd/Ctrl + P`: Quick project switcher
- `Cmd/Ctrl + N`: New project
- `Cmd/Ctrl + 0`: View all chats

## Mobile Experience
- Projects section is fully responsive
- Touch-friendly interface
- Collapsible sidebar saves screen space
- Swipe gestures for quick navigation

## Questions?
The Projects feature is fully functional and ready to use. Start organizing your MATRIX chats today!

