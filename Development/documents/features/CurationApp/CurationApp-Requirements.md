# CurationApp Requirements Document

## Overview
The CurationApp is an AI-assisted curation system that enables bulk processing of transcription records through OpenAI API to generate structured cell line metadata. The system supports concurrent processing of up to 20 curation requests with background task processing.

## Functional Requirements

### 1. User Interface Requirements
- **Location**: Separate page at `/tools/curation`
- **Navigation**: Accessible via Sidebar navigation link
- **Table Display**: Show all Article records with columns:
  - Checkbox for multi-select
  - PubMed ID
  - Approximate Tokens
  - Date Created
  - Date Modified
  - Curation Status (with real-time updates)
- **Bulk Selection**: Support selection of up to 20 articles simultaneously
- **Primary Action**: "Start Curation" button positioned at bottom of table
- **Status Indicators**: 
  - Blue: Currently being curated
  - Light Green: Successfully completed
  - Red exclamation icon: Failed (clickable for error details)

### 2. Processing Requirements
- **Concurrency**: Support up to 20 concurrent curation requests
- **Processing Time**: Handle requests that may take up to 5 minutes
- **Background Processing**: Implement asynchronous task processing
- **Input**: Process `transcription_content` from Article model
- **Output**: Generate Python dictionary mapping to CellLineTemplate model

### 3. Error Handling Requirements
- **OpenAI API Errors**: Handle server downtime, token limits, API key issues, insufficient balance
- **Application Errors**: Handle parsing errors, missing API keys
- **Error Display**: Show last curation error message in modal when red icon clicked
- **Retry Logic**: Prevent retry attempts while curation is in progress

### 4. Data Model Requirements
- **Article Model**: Use existing `curation_status` field for status tracking
- **CellLineTemplate Model**: Add `curation_source` field with values: (hpscreg, LLM, institution, manual)
- **Status Values**: pending, processing, completed, failed
- **Error Storage**: Store last error message for failed curations

### 5. API Requirements
- **Bulk Curation Endpoint**: Accept array of Article IDs for processing
- **Status Polling Endpoint**: Provide real-time status updates
- **Error Retrieval Endpoint**: Return error details for failed curations
- **Curation Function Integration**: Interface for OpenAI API curation function

## Technical Requirements

### 1. Backend Architecture
- **Framework**: Django REST Framework endpoints
- **Background Tasks**: Celery for asynchronous processing
- **Task Queue**: Redis for Celery broker
- **Database**: PostgreSQL for status persistence
- **API Integration**: OpenAI API client integration

### 2. Frontend Architecture
- **Framework**: Next.js with React components
- **UI Components**: Tailwind CSS + Preline components
- **State Management**: React hooks for status updates
- **Real-time Updates**: Polling mechanism for status changes
- **Error Handling**: Modal component for error display

### 3. Performance Requirements
- **Concurrent Processing**: 20 simultaneous curation tasks
- **Response Time**: < 2 seconds for API responses
- **Status Updates**: Real-time polling with 3-second intervals
- **Memory Management**: Efficient handling of large transcription content

### 4. Security Requirements
- **API Key Management**: Secure OpenAI API key storage
- **Input Validation**: Sanitize transcription content
- **Rate Limiting**: Prevent abuse of curation endpoints
- **Error Logging**: Secure logging without exposing sensitive data

## Integration Requirements

### 1. Navigation Integration
- Add "Curation" link to existing Sidebar.tsx
- Implement proper route handling in Next.js

### 2. Cell Line Browser Integration
- Add curation_source filter to existing cell line browser
- Enable filtering by LLM-curated cell lines

### 3. Existing Component Leverage
- Utilize existing RecordsTable.tsx patterns
- Reuse existing modal components for error display
- Integrate with existing loading states and status indicators

## User Experience Requirements

### 1. Workflow Requirements
- **Selection Flow**: Intuitive multi-select with visual feedback
- **Processing Feedback**: Clear status indicators during processing
- **Error Recovery**: Clear error messages with actionable guidance
- **Success Confirmation**: Visual confirmation of successful curation

### 2. Accessibility Requirements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Visual Indicators**: Clear visual status differentiation
- **Error Messaging**: Accessible error reporting

## Future Considerations

### 1. Scalability
- Design for potential increase in concurrent processing limits
- Consider pagination for large article datasets
- Plan for curation history tracking

### 2. Monitoring
- Basic logging for curation success/failure rates
- Performance monitoring for long-running tasks
- API usage tracking for OpenAI calls

### 3. Data Migration
- Plan for future Article → TranscriptionRecord model rename
- Ensure backward compatibility during transition

## Acceptance Criteria

### 1. Core Functionality
- ✅ User can navigate to /tools/curation
- ✅ User can select up to 20 articles for curation
- ✅ System processes curations in background
- ✅ Status updates in real-time
- ✅ Error messages displayed via modal
- ✅ Successful curations create CellLineTemplate records

### 2. Error Handling
- ✅ OpenAI API errors handled gracefully
- ✅ Application errors logged and reported
- ✅ Users cannot retry active curations
- ✅ Clear error messages for all failure scenarios

### 3. Performance
- ✅ Supports 20 concurrent curation requests
- ✅ Handles 5-minute processing times
- ✅ Responsive UI during background processing
- ✅ Efficient status polling without performance degradation

### 4. Integration
- ✅ Seamless navigation integration
- ✅ Consistent UI/UX with existing components
- ✅ Proper data flow to CellLineTemplate model
- ✅ Cell line browser filtering by curation_source 