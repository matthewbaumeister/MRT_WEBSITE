# MATRIX AI Chat Tool - Setup Documentation

## Overview
MATRIX is a modern AI chat tool integrated into the Make Ready Tech platform, providing users with AI-powered assistance using OpenAI's GPT-4 Mini model.

## Current Status: UI Complete, Backend Ready for Integration

### Completed Features

#### 1. User Interface
- Modern chat interface with brand colors (#2F2F72 purple, #D4AF37 gold)
- Responsive design that works on desktop and mobile
- Clean "How can I help you today?" welcome screen
- Make Ready logo displayed in top right
- Sidebar toggle button in top left (visible on all screen sizes)

#### 2. Main Chat Features
- **Message Input**: Large text input area with placeholder
- **File Upload**: Working upload button that accepts:
  - PDF (.pdf)
  - Word Documents (.doc, .docx)
  - Text Files (.txt)
  - CSV (.csv)
  - Excel Files (.xlsx, .xls)
- **Uploaded Files Display**: Shows selected files with remove option
- **Model Selector**: Displays "GPT-4 Mini" with tooltip "More models coming soon"
- **Submit Button**: Animated loading state when processing
- **Options Menu**: Includes toggles for:
  - Extended thinking
  - Web search
  - Research mode

#### 3. Sidebar Features
- **New Chat Button**: Prominent button to start new conversations
- **Recent Chats**: Section to display past conversations (ready for Supabase data)
- **Navigation Links**:
  - Home (links to /platforms)
  - Projects
  - Artifacts
  - Code
- **User Account Section**: Shows user avatar, name, role, and sign out button

#### 4. Backend Structure
- **API Route**: `/app/api/matrix/chat/route.ts`
  - Authenticates users via NextAuth
  - Connects to OpenAI API with GPT-4 Mini
  - Returns formatted responses
  - Ready for Supabase integration (marked with TODO)

#### 5. Database Schema
- **SQL File**: `SUPABASE_MATRIX_TABLES.sql`
- **Tables Created**:
  - `matrix_conversations`: Stores chat sessions per user
  - `matrix_messages`: Stores individual messages
- **Security**: Full Row Level Security (RLS) policies implemented
- **Features**:
  - Auto-updating timestamps
  - Proper indexing for performance
  - User-specific data isolation

## Environment Variables

### Already Set in Vercel
- `OPENAI_API_KEY`: Your OpenAI API key

### Required Variables (should already be set)
- `NEXTAUTH_URL`: Application URL
- `NEXTAUTH_SECRET`: NextAuth secret key
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_KEY`: Supabase service role key

## Accessing MATRIX

### URL
```
https://matrix.makereadytech.com/
```

### Authentication
- Users must be logged in to access MATRIX
- Redirects to `/login?callbackUrl=/matrix` if not authenticated
- Available to all authenticated users (General, Employee, Admin tiers)

## Next Steps for Full Integration

### 1. Set Up Supabase Tables
Run the SQL script in your Supabase SQL Editor:
```sql
-- Located in: SUPABASE_MATRIX_TABLES.sql
```

### 2. Connect Chat to OpenAI API
Update `MatrixChat.tsx` to call the API endpoint:
```typescript
// Replace the setTimeout mock with:
const response = await fetch('/api/matrix/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [...messages, userMessage],
    model: 'gpt-4-mini'
  })
});
```

### 3. Implement Chat History
- Load past conversations from Supabase
- Save new conversations and messages
- Update sidebar with real data

### 4. File Processing (Future Enhancement)
- Upload files to Supabase Storage
- Process documents for context
- Include file content in OpenAI prompts

## Technical Architecture

### Frontend Components
```
/app/matrix/
  ├── page.tsx           # Main page with state management
  └── layout.tsx         # SessionProvider wrapper

/components/matrix/
  ├── MatrixChat.tsx     # Main chat interface
  └── MatrixSidebar.tsx  # Sidebar with history and navigation
```

### API Routes
```
/app/api/matrix/
  └── chat/
      └── route.ts       # OpenAI chat endpoint
```

### Authentication Flow
1. User accesses `/matrix`
2. Middleware checks authentication
3. If not logged in → redirect to login
4. If logged in → load Matrix interface
5. All API calls include session validation

## Design Specifications

### Colors
- Background: `bg-gray-900` (dark)
- Sidebar: `bg-gray-950` (darker)
- Input: `bg-gray-800` (medium dark)
- Primary Gradient: `from-primary-600 to-accent-500` (purple to gold)
- Text: `text-white`, `text-gray-400`

### Typography
- Headers: Bold, white
- Body: Light, gray-400
- User Messages: White on gradient background
- AI Messages: Gray-100 on gray-800 background

### Layout
- Full-height screen (`h-screen`)
- Fixed sidebar (264px on desktop)
- Flexible chat area
- Bottom-pinned input area

## Testing Checklist

### UI Testing
- [ ] Can toggle sidebar open/closed
- [ ] Can upload files
- [ ] Can remove uploaded files
- [ ] Model selector shows tooltip on hover
- [ ] Options menu opens and toggles work
- [ ] Submit button disabled when input empty
- [ ] Loading state shows when processing
- [ ] Messages display correctly
- [ ] Responsive on mobile devices

### Backend Testing
- [ ] API endpoint authenticates users
- [ ] API connects to OpenAI successfully
- [ ] Supabase tables created properly
- [ ] RLS policies work correctly
- [ ] Chat history saves to database
- [ ] Chat history loads from database

## Future Enhancements

### Phase 2 Features
1. **Document Analysis**: Process uploaded documents and answer questions about them
2. **Web Search**: Integrate real-time web search capabilities
3. **Code Generation**: Syntax highlighting for code responses
4. **Export Conversations**: Download chat history as PDF or text
5. **Share Conversations**: Generate shareable links
6. **Voice Input**: Speech-to-text for hands-free operation

### Phase 3 Features
1. **Custom Models**: Allow model selection (GPT-4, GPT-4 Turbo, etc.)
2. **Fine-tuning**: Train custom models on company data
3. **Team Collaboration**: Share conversations with team members
4. **API Access**: Provide API for programmatic access
5. **Analytics**: Usage statistics and insights dashboard

## Support & Maintenance

### Monitoring
- Check OpenAI API usage in OpenAI dashboard
- Monitor Supabase database size
- Track user engagement metrics

### Cost Management
- GPT-4 Mini is cost-effective for most use cases
- Implement token limits if needed
- Archive old conversations to manage storage

### Security
- All data encrypted in transit and at rest
- RLS ensures user data isolation
- Regular security audits recommended
- Keep dependencies updated

## Notes
- Currently using mock response in UI (1-second delay)
- OpenAI API route is ready but not connected to UI yet
- No data is being saved to Supabase yet
- File uploads work but files aren't processed yet
- All toggles in options menu are UI-only for now

## Contact
For questions or issues with MATRIX:
- Technical Lead: Matt Baumeister
- Documentation: This file
- API Documentation: OpenAI API docs

