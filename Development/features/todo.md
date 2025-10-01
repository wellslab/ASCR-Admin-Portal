# TODO

## Schema Validation
- [ ] Implement conditional schema validation that only triggers when work_status changes to "reviewed"
  - Allow incomplete/invalid fields while work_status is "in progress" 
  - Enforce full schema compliance only during review process
  - Create validation script for the review workflow

## User Authentication & Personal Features
- [ ] Implement user authentication system
  - Add login/logout functionality
  - Create user registration flow
  - Implement session management
- [ ] Add user profiles and management
  - User profile database models
  - User-specific data storage
- [ ] Personal todo feature
  - Floating icon in bottom corner of AdminPortal
  - Popup text editor for personal todos
  - User-specific todo storage and persistence
  - CRUD operations for personal todos