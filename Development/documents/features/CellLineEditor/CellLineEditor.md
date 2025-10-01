# CellLineEditor feature design

## User Story / Requirements

The principal curator of the ASCR (Dr. Suzy Butcher) has a background in biology and not IT. 
As a part of of the curation activities in the ASCR, there is a collection of cell line JSON files.
For a certain cell line X, the curated metadata for the cell line is stored in a cell_line_X.json file.

We want an easy way for Suzy to edit these json files, without touching the raw files.
She should be able to navigate to a page on website, either:
1. **Select a cell line to edit** (from the ones stored in the database), and an editor window should appear where she can edit each individual metadata field for the cell line.
2. **Click "Add Cell Line"** to create a new cell line from a blank template based on the schema, fill in fields as needed, and save the new cell line to the database.

She should then be able to hit save, and the newly edited or created metadata is saved.

The editor should be able to handle the nested structure of json files.
We want to emphasise the user experience here.



## Feature request
Web-based JSON editor for editing cell line JSON files.

## Requirements

### Data Structure & Storage
- **R1.1**: All cell line JSON files follow a consistent schema defined by an existing Pydantic model
- **R1.2**: Cell line data should be accessible from the database (TODO: migrate JSON files from filesystem to database)
- **R1.3**: Support metadata fields of various types: text, numbers, dates, booleans, and nested objects
- **R1.4**: Handle JSON nesting up to 2-3 levels deep
- **R1.5**: Support 300-3000 cell lines with approximately 150 fields each

### User Interface & Experience
- **R2.1**: Render all fields as free-text editable inputs for simplicity
- **R2.2**: Indicate required fields with asterisk (*) notation
- **R2.3**: Provide intuitive interface for editing nested objects and arrays
- **R2.4**: Allow users to dynamically add/remove items from arrays
- **R2.5**: Allow users to edit items within nested objects
- **R2.6**: Ensure compatibility with all popular web browsers
- **R2.7**: Prioritize user experience for non-technical users

### Cell Line Selection & Creation
- **R3.1**: Implement search functionality to select cell lines by name
- **R3.2**: Provide efficient navigation through large numbers of cell lines (300-3000)
- **R3.3**: Provide "Add Cell Line" functionality to create new cell lines from blank schema template
- **R3.4**: Support dual-mode editor that handles both editing existing and creating new cell lines

### Validation & Data Integrity
- **R4.1**: TODO: Create validation script for cell line objects
- **R4.2**: Integrate validation script into the save function for both new and existing cell lines
- **R4.3**: Display clear error messages for validation failures
- **R4.4**: Prevent saving of invalid data
- **R4.5**: Require manual input of hpscreg_id for new cell lines (provided by Dr. Butcher)
- **R4.6**: Validate uniqueness of hpscreg_id during new cell line creation

### Version Control & History
- **R5.1**: Implement version control system for all cell line edits
- **R5.2**: Store and display last 10 versions of each cell line
- **R5.3**: Provide ability to revert to previous versions
- **R5.4**: Implement side-by-side diff view between any two versions
- **R5.5**: Track metadata for each version (timestamp, user, changes made)

### Access Control & Security
- **R6.1**: Restrict editing access to authorized users (initially Dr. Butcher)
- **R6.2**: Prevent concurrent editing of the same cell line
- **R6.3**: Implement proper authentication and authorization
- **R6.4**: Maintain audit trail of who made what changes and when

### Integration & Technical
- **R7.1**: Integrate seamlessly with existing Django backend
- **R7.2**: Integrate with existing Next.js frontend
- **R7.3**: Provide web-based access through the main website
- **R7.4**: Ensure responsive design for various screen sizes
- **R7.5**: Maintain performance with large datasets (3000 cell lines × 150 fields)

### Outstanding TODOs
- **TODO-1**: Migrate cell line JSON files from filesystem to database
- **TODO-2**: Implement validation script for cell line objects
- **TODO-3**: Design and implement version control system architecture
- **TODO-4**: Define detailed approach for diff visualization between versions

## Proposal: Custom Dynamic JSON Editor with Integrated Version Control

### Overview
Build a custom React-based JSON editor that dynamically generates form fields based on the Pydantic model schema, with integrated version comparison and diff visualization capabilities.

### Core Architecture

#### Frontend Components
- **Dynamic Form Generator**: React component that interprets JSON schema and renders appropriate input fields
- **Nested Structure Handler**: Custom components for editing nested objects and arrays with intuitive add/remove functionality
- **Version Comparison View**: Side-by-side diff visualization using the same field components as the editor
- **Unified Field Components**: Reusable field components that support both edit and read-only/diff modes

#### Backend Architecture
- **Database-First Approach**: Django models mirroring Pydantic schema structure
- **Version Control System**: Separate `CellLineVersion` model for storing historical versions
- **Atomic Save Operations**: REST API endpoints ensuring data consistency
- **Schema Introspection**: API endpoints to provide JSON schema to frontend

### Key Benefits

#### Seamless Edit-to-Compare Workflow
- **Unified Architecture**: Same React components handle both editing and version comparison
- **Consistent UX**: Smooth transitions between edit mode and compare mode
- **Integrated Diff Highlighting**: Built-in visualization of changes within nested structures
- **Field-Level Actions**: Future capability for "revert this field" or "copy from version X"

#### Customized User Experience
- **Non-Technical User Focus**: Interface designed specifically for Dr. Butcher's workflow
- **Schema-Driven Validation**: Real-time validation based on Pydantic model constraints
- **Intuitive Nested Editing**: Custom handling of complex JSON structures
- **Performance Optimization**: Efficient rendering for large datasets (3000+ cell lines)

### Implementation Approach

#### Phase 1: Core Editor (3-4 weeks)
1. Schema introspection and dynamic form generation
2. Basic field editing for primitive types
3. Nested object and array editing components
4. Save functionality with validation

#### Phase 2: Version Control Integration (2-3 weeks)
1. Version storage and retrieval system
2. Side-by-side comparison interface
3. Diff highlighting and visualization
4. Version history timeline

#### Phase 3: Advanced Features (2-3 weeks)
1. Search and filtering for cell line selection
2. Concurrent editing prevention
3. Advanced diff features (field-level revert, etc.)
4. Performance optimizations

### Technical Considerations

#### Challenges
- **Development Time**: 7-10 weeks total implementation time
- **State Management**: Complex state handling for nested structures and version comparison
- **Schema Synchronization**: Keeping frontend schema interpretation in sync with backend Pydantic models
- **Performance**: Efficient rendering and comparison of large JSON structures

#### Mitigation Strategies
- **Incremental Development**: Phased approach allows for early user feedback
- **Component Reusability**: Unified field components reduce code duplication
- **Schema Caching**: Frontend caching of schema information for performance
- **Lazy Loading**: Load version history and comparison data on demand

### Decision Rationale
This proposal was selected over existing JSON editor libraries because:
1. **Integrated Version Control**: Seamless edit-to-compare workflow is critical for Dr. Butcher's curation activities
2. **User Experience**: Custom components can be optimized for non-technical users
3. **Future Flexibility**: Custom architecture allows for advanced features like field-level version control
4. **Architectural Consistency**: Unified approach across editing and comparison features

### Technical Design Decisions

#### Schema Introspection Strategy: Hybrid Approach
**Approach**: Embedded schema for initial page load + live API endpoint for development
- **Production**: Schema embedded in page load for reliability and performance
- **Development**: Live API endpoint for real-time sync during Pydantic model changes
- **Benefits**: Combines reliability of embedded approach with development speed of live API
- **Implementation**: Fallback mechanism where embedded schema is used if API endpoint fails

#### Nested Structure UI Patterns
**Collapsible Sections with Array Controls**:
- **Nested Objects**: Collapsible sections with expand/collapse functionality
- **Array Management**: Simple +/- button interface for adding/removing array items
- **Visual Hierarchy**: Clear indentation and grouping to show JSON structure
- **Progressive Disclosure**: Users can focus on relevant sections while keeping interface uncluttered

#### Version Comparison Granularity: Field-Level Highlighting
**Diff Visualization Strategy**:
- **Changed Fields**: Highlighted background (yellow/orange) to indicate modifications
- **Added Fields**: Green background for newly added fields
- **Removed Fields**: Red background with strikethrough for deleted fields
- **Array Changes**: Clear indication of which array items were added, removed, or modified
- **Rationale**: Field-level granularity provides clear, actionable information without overwhelming non-technical users











