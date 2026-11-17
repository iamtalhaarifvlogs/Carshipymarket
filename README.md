# Okomoto Frontend - Client Handover Documentation

Welcome to the **Okomoto Frontend** codebase. This repository contains the Next.js web application for Okomoto, a modern vehicle reservation, bidding, and export platform tailored for the Nigerian market. 

This document serves as a complete reference guide for installing, configuring, running, and understanding the architecture of the frontend application.



##  Tech Stack & Core Libraries

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router configuration)
- **UI Library**: [React 18](https://react.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React Redux](https://react-redux.js.org/)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/) & custom CSS stylesheets
- **HTTP client**: [Axios](https://axios-http.com/)
- **Authentication**: Custom OAuth backend Integration & [Google OAuth v2 Client](https://www.npmjs.com/package/@react-oauth/google)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)


##  Project & Code Structure

The source code is organized cleanly under the `src` directory:

```text
okomoto-frontend/
├── public/                 # Static assets (favicons, icons, global default images)
└── src/
    ├── app/                # Next.js App Router folders and routes
    │   ├── (auth)/         # Group for auth pages (login, signup, forgot/reset password, verify email)
    │   ├── (pages)/        # Group for main app pages (cars, dashboard, reservations, terms, contact-us, etc.)
    │   ├── globals.css     # Global style rules
    │   └── layout.js       # Main entry layout containing providers
    ├── assets/             # Images, custom layout responsive styles, and animations
    ├── components/         # Global shared components
    │   ├── layout/         # Header/Navbar, Footer, Notification dropdown, and FCM listeners
    │   └── CarCard.js      # Key component representing a single vehicle card
    ├── context/            # React Contexts (e.g., AuthContext for restoring authentication status)
    ├── modules/            # Domain/Feature-specific page modules to keep the routes clean
    │   ├── blog/           # Blog section components and views
    │   ├── common/         # Common layout modules (e.g., Trust and inquiry banners)
    │   ├── dashboard/      # Main Dashboard layout, filters, search, and paginated inventory lists
    │   ├── home/           # HomePage vehicle carousels, details modal, and search banners
    │   └── shipping-quote/ # Shipping cost calculation forms and results page
    ├── services/           # API Services using Axios wrappers
    │   ├── axios.js        # Global HTTP client config (includes request token headers and 401 automatic logout redirection)
    │   ├── auth.service.js # API endpoints mapping for auth operations
    │   └── vehicle.service.js # API endpoints mapping for vehicle search, quote calculation, and liking vehicles
    ├── store/              # Redux Toolkit global store configuration
    │   ├── slices/         # Slices managing state slices (e.g. auth slice with login status, profile details, loaders)
    │   └── store.js        # Global Redux store definition
    └── utils/              # Helper utility scripts
        ├── image.js        # Dynamic image URL extraction and domain fallback mapping
        └── password.js     # Password complexity check logic
```

##  Environment Variables Setup

Environment Configuration
Create a .env.local file in the root directory and add the following keys:

# Base API Gateway Server Endpoint
NEXT_PUBLIC_BASE_URL=https://api-ogamoto.itechnolabs.tech/api/v1/

##  Installation & Setup

Ensure you have **Node.js (version 18 or higher)** installed on your machine.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:4231](http://localhost:4231) in your browser to interact with the local development instance. (Port config is specified under `package.json`).

### 3. Create a Production Build
Compile and optimize the codebase for production use:
```bash
npm run build
```

### 4. Start the Production Server
Deploy and host the optimized build locally or on your target environment:
```bash
npm run start
```


##  Authentication Flow
 
1. **Token Persistence**: JWT authentication tokens and current user settings are persisted in both the Redux store state and the browser's `localStorage`.
2. **Auto Restoration**: On initial load, the custom `AuthProvider` checks `localStorage` and automatically requests the user profile (`fetchUserProfile`) to maintain login state.
3. **HTTP Interceptor**: `axios.js` intercepts all outbound requests to append the authorization header (`Bearer token`) if available.
4. **Automatic Expiry Logout**: If any endpoint returns a `401 Unauthorized` status (excluding login endpoints), the request interceptor clears all local keys and redirects the browser to the `/login` route.


##  Code Documentation Standards

All critical files contain detailed inline comments explaining the core logic, state hooks, and API integrations. When extending or editing the code, please maintain this structure:
- Add a **File Header** detailing the purpose and major dependencies.
- Add JSDoc comments to **helper functions** specifying parameter types and returns.
- Include **inline annotations** on complex hooks (`useEffect`, `useCallback`, `useSelector`) to keep the business logic maintainable.
