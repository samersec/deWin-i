# Login Flow Documentation

## Overview
This document explains the complete login flow in the DeWini application, from the frontend to the backend and back. The application supports two types of users: patients and doctors, each with their own login interface.

## Architecture
- Frontend: React with TypeScript
- Backend: Spring Boot (Java)
- Database: MongoDB
- Authentication: Custom implementation with role-based access control

## File Objectives

### Frontend Files

#### 1. `PatientLogin.tsx`
- **Objective**: Provides the user interface for patient authentication
- **Key Responsibilities**:
  - Render patient login form
  - Handle form submission
  - Display error messages
  - Provide navigation to doctor login

#### 2. `DoctorLogin.tsx`
- **Objective**: Provides the user interface for doctor authentication
- **Key Responsibilities**:
  - Render doctor login form
  - Handle form submission
  - Display error messages
  - Provide navigation to patient login

#### 3. `AuthContext.tsx`
- **Objective**: Manages authentication state and logic across the application
- **Key Responsibilities**:
  - Maintain user session state
  - Handle login/logout operations
  - Provide authentication status to components
  - Manage role-based access control

#### 4. `ProtectedRoute.tsx`
- **Objective**: Implements route protection based on authentication and roles
- **Key Responsibilities**:
  - Verify user authentication status
  - Check user roles
  - Redirect unauthorized access
  - Protect sensitive routes

### Backend Files

#### 1. `User.java`
- **Objective**: Defines the user data model
- **Key Responsibilities**:
  - Define user attributes
  - Provide data structure for user information
  - Support MongoDB document mapping

#### 2. `UserRepository.java`
- **Objective**: Handles database operations for user data
- **Key Responsibilities**:
  - Provide methods for user queries
  - Handle database interactions
  - Support user authentication operations

#### 3. `UserController.java`
- **Objective**: Manages HTTP requests related to user operations
- **Key Responsibilities**:
  - Handle login requests
  - Process authentication
  - Return appropriate responses
  - Manage error handling

#### 4. `CorsConfig.java`
- **Objective**: Configures Cross-Origin Resource Sharing
- **Key Responsibilities**:
  - Define allowed origins
  - Configure allowed HTTP methods
  - Set up security headers
  - Enable credentials

#### 5. `ServerApplication.java`
- **Objective**: Main entry point for the Spring Boot application
- **Key Responsibilities**:
  - Initialize the application
  - Configure Spring Boot
  - Set up basic endpoints
  - Enable CORS

## Frontend vs Backend Files

### Frontend Files (Client-side)
1. **Location**: `client/src/` directory
2. **File Extensions**:
   - `.tsx` - TypeScript React files
   - `.ts` - TypeScript files
   - `.css` - Styling files
3. **Key Characteristics**:
   - Run in the user's browser
   - Handle user interface and interactions
   - Make HTTP requests to backend
   - Manage client-side state
   - Handle routing and navigation
4. **Example Files**:
   - `PatientLogin.tsx` - User interface for patient login
   - `AuthContext.tsx` - Frontend state management
   - `ProtectedRoute.tsx` - Frontend route protection

### Backend Files (Server-side)
1. **Location**: `server/src/` directory
2. **File Extensions**:
   - `.java` - Java source files
   - `.properties` - Configuration files
3. **Key Characteristics**:
   - Run on the server
   - Handle business logic
   - Interact with database
   - Process HTTP requests
   - Manage security
4. **Example Files**:
   - `UserController.java` - Handles HTTP requests
   - `UserRepository.java` - Database operations
   - `User.java` - Data model

### Key Differences

#### 1. Purpose
- **Frontend**:
  - User interface
  - Client-side validation
  - State management
  - User experience
- **Backend**:
  - Business logic
  - Data processing
  - Database operations
  - Security enforcement

#### 2. Technology Stack
- **Frontend**:
  - React
  - TypeScript
  - HTML/CSS
  - Browser APIs
- **Backend**:
  - Java
  - Spring Boot
  - MongoDB
  - Server APIs

#### 3. Security
- **Frontend**:
  - Client-side validation
  - UI security
  - Token management
- **Backend**:
  - Server-side validation
  - Database security
  - Authentication logic
  - Authorization rules

#### 4. Data Flow
- **Frontend**:
  - Sends requests to backend
  - Receives and displays data
  - Manages local state
- **Backend**:
  - Receives requests
  - Processes data
  - Interacts with database
  - Sends responses

#### 5. Error Handling
- **Frontend**:
  - UI error messages
  - Network error handling
  - Form validation
- **Backend**:
  - Server error handling
  - Database error management
  - Security error responses

#### 6. Performance
- **Frontend**:
  - Browser rendering
  - Client-side caching
  - UI responsiveness
- **Backend**:
  - Server processing
  - Database optimization
  - Request handling

## Frontend Components

### 1. Login Pages
- `PatientLogin.tsx`: Patient login interface
- `DoctorLogin.tsx`: Doctor login interface
- Both pages share similar UI components but are separated for better user experience

### 2. Authentication Context
Located in `AuthContext.tsx`, this provides:
- User state management
- Login/logout functionality
- Role-based navigation
- Error handling

## Backend Components

### 1. User Model
Located in `User.java`:
```java
public class User {
    private String id;
    private String nom;
    private String prenom;
    private String email;
    private String password;
    private String role;
    // Getters and setters
}
```

### 2. User Repository
Located in `UserRepository.java`:
- Extends `MongoRepository` 
- Provides method to find users by email

### 3. User Controller
Located in `UserController.java`:
- Handles login requests
- Validates credentials
- Returns user data or error response

## Login Flow

### 1. User Interface
1. User navigates to either `/login/patient` or `/login/medecin`
2. User enters email and password
3. Form submission triggers `handleSubmit` function

### 2. Frontend Processing
1. `handleSubmit` prevents default form submission
2. Calls `login` function from `AuthContext`
3. `login` function:
   - Makes POST request to `http://localhost:8081/api/users/login`
   - Sends email and password in request body
   - Handles response and errors

### 3. Backend Processing
1. Request received by `UserController`
2. Controller:
   - Extracts email and password from request
   - Queries database using `UserRepository`
   - Validates credentials
   - Returns user data or error

### 4. Response Handling
1. On successful login:
   - User data stored in `AuthContext`
   - User redirected based on role:
     - Patients → `/patient`
     - Doctors → `/doctor`
2. On failed login:
   - Error message displayed to user
   - User remains on login page

## Security Features

### 1. CORS Configuration
- Backend configured to accept requests from `http://localhost:5173`
- Specific HTTP methods allowed
- Credentials allowed for authentication

### 2. Protected Routes
- `ProtectedRoute` component ensures:
  - Only authenticated users can access protected pages
  - Users can only access pages matching their role
  - Unauthorized access attempts are redirected to login

## Error Handling

### Frontend
- Form validation for required fields
- Password confirmation for registration
- Display of backend error messages
- Network error handling

### Backend
- Invalid credentials handling
- Database query error handling
- Input validation

## Database
- MongoDB database named "DeWini"
- User collection stores:
  - User credentials
  - Personal information
  - Role information

## Configuration
- Backend runs on port 8081
- Frontend runs on port 5173
- MongoDB runs on default port 27017

## Best Practices Implemented
1. Separation of concerns
2. Role-based access control
3. Secure password handling
4. Error handling at all levels
5. Clean and maintainable code structure
6. Responsive UI design
7. Type safety with TypeScript 

## Detailed Login Workflow

### 1. User Initiates Login
1. User navigates to login page:
   - Patients go to `/login/patient`
   - Doctors go to `/login/medecin`
2. User sees login form with:
   - Email input field
   - Password input field
   - "Se connecter" (Login) button
   - "Mot de passe oublié" (Forgot password) link
   - Link to switch between patient/doctor login

### 2. Frontend Form Handling
1. User enters credentials:
   ```typescript
   // In PatientLogin.tsx or DoctorLogin.tsx
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   ```
2. Form submission triggers `handleSubmit`:
   ```typescript
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     try {
       await login(email, password, isDoctorLogin);
       navigate('/patient' or '/doctor');
     } catch (error) {
       setError(error.message);
     }
   };
   ```

### 3. Authentication Context Processing
1. `AuthContext` receives login request:
   ```typescript
   const login = async (email: string, password: string, isDoctorLogin: boolean) => {
     try {
       const response = await fetch('http://localhost:8081/api/users/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password }),
       });
   ```
2. Makes HTTP request to backend
3. Handles response and errors

### 4. Backend Processing
1. Request received by `UserController`:
   ```java
   @PostMapping("/login")
   public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
       Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
   ```
2. Database query execution:
   - Queries MongoDB User collection
   - Searches for user by email
3. Password verification:
   ```java
   if (userOpt.isPresent()) {
       User user = userOpt.get();
       if (user.getPassword().equals(loginRequest.getPassword())) {
           return ResponseEntity.ok(user);
       }
   }
   ```

### 5. Response Handling
1. Successful Login:
   - Backend returns user data
   - Frontend stores user in `AuthContext`
   - User is redirected based on role:
     ```typescript
     if (userRole === 'medecin') {
       navigate('/doctor');
     } else if (userRole === 'patient') {
       navigate('/patient');
     }
     ```

2. Failed Login:
   - Backend returns error
   - Frontend displays error message:
     ```typescript
     setError(error.message || 'Identifiants invalides');
     ```
   - User remains on login page

### 6. Protected Route Verification
1. After successful login, `ProtectedRoute` component:
   ```typescript
   if (!user) {
     return <Navigate to="/login/patient" replace />;
   }
   if (!allowedRoles.includes(user.role.toLowerCase())) {
     return <Navigate to="/login/patient" replace />;
   }
   ```
2. Verifies:
   - User is authenticated
   - User has correct role
   - Redirects if unauthorized

### 7. Session Management
1. User data stored in `AuthContext`:
   ```typescript
   const [user, setUser] = useState<User | null>(null);
   ```
2. Available throughout application
3. Used for:
   - Access control
   - Displaying user information
   - Role-based features

### 8. Logout Process
1. User clicks logout
2. `AuthContext` handles logout:
   ```typescript
   const logout = () => {
     setUser(null);
     setError(null);
     navigate('/login/patient');
   };
   ```
3. Clears user data
4. Redirects to login page

## Security Measures in Login Flow

### 1. Frontend Security
- Form validation
- Password field masking
- Error message handling
- CORS configuration

### 2. Backend Security
- Input validation
- Password verification
- Role-based access control
- Error handling

### 3. Database Security
- MongoDB connection security
- User data protection
- Query security 