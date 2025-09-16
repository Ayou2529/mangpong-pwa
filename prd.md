# Product Requirements Document (PRD)
## Mangpong Trading PWA

**Version:** 1.0  
**Date:** 15 กันยายน 2568  
**Product Manager:**  
**Development Team:**

---

## 1. Executive Summary

### 1.1 Product Overview
Mangpong Trading PWA is a Progressive Web Application designed for Mangpong Trading Company to streamline their delivery job management process. The application allows messengers, employees, and owners to efficiently record, track, and manage delivery jobs with seamless integration to Google Sheets for data storage.

### 1.2 Business Objectives
- Digitalize the job recording process to eliminate paper-based workflows
- Improve data accuracy and reduce errors in job documentation
- Enable real-time tracking of job statuses and performance metrics
- Facilitate transparent salary calculation based on a 70/30 commission split
- Provide offline functionality for field operations with automatic sync when online

### 1.3 Target Users
1. **Messengers** (7 features)
   - Record delivery jobs
   - Track job statuses
   - View job history
   - Manage drafts
   - Calculate earnings
   - Export job reports
   - Offline job recording

2. **Employees/Admin** (5 features)
   - Manage job records
   - Generate reports
   - Monitor messenger performance
   - Handle incomplete jobs
   - User management

3. **Owners** (4 features)
   - View business analytics
   - Monitor financial performance
   - Track employee productivity
   - Access payroll information

---

## 2. Product Requirements

### 2.1 Functional Requirements

#### 2.1.1 User Authentication
| Feature | Description | Priority |
|---------|-------------|----------|
| User Registration | New users can register with username, password, full name, phone, and email | High |
| User Login | Registered users can securely log in to the system | High |
| Session Management | Maintain user sessions with automatic timeout | Medium |

#### 2.1.2 Job Management
| Feature | Description | Priority |
|---------|-------------|----------|
| Create New Job | Users can create new delivery jobs with complete details | High |
| Job Details | Capture company, assigner info, pickup location, delivery details, and amounts | High |
| Job Status Tracking | Track jobs as Complete, Incomplete, or Draft | High |
| Edit Jobs | Users can modify existing job records | High |
| Job History | View historical job records with filtering capabilities | High |
| PDF Export | Export job history to PDF format | Medium |

#### 2.1.3 Dashboard & Analytics
| Feature | Description | Priority |
|---------|-------------|----------|
| Daily Statistics | Display jobs recorded today, completed today | High |
| Monthly Reports | Show monthly job counts and trends | High |
| Performance Metrics | Track key performance indicators | Medium |
| Quick Actions | Direct access to common functions | Medium |

#### 2.1.4 Offline Functionality
| Feature | Description | Priority |
|---------|-------------|----------|
| Offline Job Recording | Record jobs even without internet connection | High |
| Request Queue | Queue requests for processing when online | High |
| Data Sync | Automatically sync offline data when connectivity is restored | High |

#### 2.1.5 Salary & Payroll
| Feature | Description | Priority |
|---------|-------------|----------|
| Commission Calculation | Automatic calculation based on 70/30 split | High |
| Base Salary Tracking | Track base salary of 15,000 THB | Medium |
| Earnings Summary | Display total earnings for messengers | Medium |

### 2.2 Non-Functional Requirements

#### 2.2.1 Performance
- Application should load within 3 seconds on average mobile connections
- Job submission should complete within 5 seconds under normal conditions
- Offline data sync should process within 10 seconds of connectivity restoration

#### 2.2.2 Usability
- Mobile-first responsive design optimized for touch interactions
- Support for minimum 44px touch targets for accessibility
- Thai language interface with Prompt font for readability
- Intuitive navigation with bottom tab bar

#### 2.2.3 Reliability
- Handle network failures gracefully with offline capability
- Implement retry mechanisms for failed requests (up to 3 attempts)
- Data validation to prevent corrupted entries
- Error handling with user-friendly messages

#### 2.2.4 Security
- Secure authentication with password hashing
- Data encryption in transit using HTTPS
- Protection against common web vulnerabilities
- Secure storage of authentication tokens

#### 2.2.5 Compatibility
- Support for modern mobile browsers (Chrome, Safari, Firefox)
- iOS and Android compatibility
- Progressive Web App capabilities (installable, works offline)
- Responsive design for various screen sizes

---

## 3. Technical Requirements

### 3.1 Frontend Technology Stack
- **Core:** HTML5, CSS3, JavaScript (ES6+)
- **UI Framework:** Tailwind CSS
- **PWA Features:** Service workers, Web App Manifest
- **Libraries:** 
  - SweetAlert2 for notifications
  - jsPDF for PDF export
  - Google Fonts (Prompt)

### 3.2 Backend & Data Storage
- **Backend:** Google Apps Script
- **Database:** Google Sheets
- **API Endpoint:** https://script.google.com/macros/s/AKfycbxZIMrFlOm3IzVSM-PqmgA91v-t48szqLLk9HD0IKdW9FBd3BFJ7SE9Eci6NEBcNa9v/exec

### 3.3 Data Structure
Jobs contain the following key fields:
- Job ID (auto-generated)
- Timestamp
- Status (complete, incomplete, draft)
- Company information
- Assigner details
- Pickup location (province, district)
- Delivery details (company, province, district, recipient, description)
- Amounts (main service fee, additional fees, total)
- Incomplete reason (for incomplete jobs)

---

## 4. User Stories

### 4.1 Messenger User Stories
1. As a messenger, I want to create a new job record so that I can document my deliveries
2. As a messenger, I want to view my job history so that I can track my work
3. As a messenger, I want to save jobs as drafts so that I can complete them later
4. As a messenger, I want to edit incomplete jobs so that I can correct any errors
5. As a messenger, I want to calculate my earnings so that I know how much I've made
6. As a messenger, I want to record jobs offline so that I can work in areas with poor connectivity
7. As a messenger, I want to export my job history to PDF so that I can share it with others

### 4.2 Admin User Stories
1. As an admin, I want to view all job records so that I can monitor operations
2. As an admin, I want to generate reports so that I can analyze business performance
3. As an admin, I want to manage user accounts so that I can control system access
4. As an admin, I want to handle incomplete jobs so that data accuracy is maintained
5. As an admin, I want to track messenger performance so that I can provide feedback

### 4.3 Owner User Stories
1. As an owner, I want to view business analytics so that I can understand company performance
2. As an owner, I want to monitor financial metrics so that I can make informed decisions
3. As an owner, I want to track employee productivity so that I can optimize operations
4. As an owner, I want to access payroll information so that I can process payments

---

## 5. Acceptance Criteria

### 5.1 Job Creation
- User can successfully create a new job with all required fields
- System validates all input data before submission
- Job is saved to Google Sheets with proper formatting
- User receives confirmation of successful job creation

### 5.2 Job Editing
- User can access existing jobs for editing
- Changes are properly saved to the database
- System maintains job history and audit trail

### 5.3 Offline Functionality
- Application functions properly without internet connection
- Data is queued for submission when offline
- Queue is automatically processed when connectivity is restored
- User is notified of successful sync completion

### 5.4 Data Accuracy
- All monetary values are calculated correctly
- Commission split is applied accurately (70/30)
- Date/time stamps are properly formatted
- No data loss during sync operations

---

## 6. Success Metrics

### 6.1 User Engagement
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- Average session duration

### 6.2 Performance Metrics
- Job submission success rate
- Offline sync success rate
- Average load time
- Error rate

### 6.3 Business Metrics
- Number of jobs recorded per day
- Reduction in paper usage
- Time saved in job recording
- Accuracy improvement in data entry

---

## 7. Risks & Mitigations

### 7.1 Technical Risks
| Risk | Mitigation |
|------|------------|
| Google Sheets API limitations | Implement request queueing and batching |
| Network connectivity issues | Robust offline functionality with data sync |
| Data corruption | Input validation and error handling |
| Performance degradation | Caching mechanisms and lazy loading |

### 7.2 Business Risks
| Risk | Mitigation |
|------|------------|
| User adoption resistance | Training materials and support |
| Data security concerns | Secure authentication and encryption |
| Dependency on Google services | Regular monitoring and backup procedures |

---

## 8. Future Enhancements

### 8.1 Phase 2 Features
- Real-time notifications for job updates
- Advanced reporting and analytics dashboard
- Multi-language support
- Integration with GPS for location tracking
- Barcode/QR code scanning for job identification

### 8.2 Phase 3 Features
- Mobile app native implementation
- Advanced user roles and permissions
- Integration with third-party logistics platforms
- Automated invoice generation
- Customer feedback collection system

---

## 9. Glossary

- **PWA:** Progressive Web Application
- **GAS:** Google Apps Script
- **UI:** User Interface
- **API:** Application Programming Interface
- **PDF:** Portable Document Format