This is an old project and does not describe my products.
---
# API Gateway Project

## Overview
This project serves as an API Gateway that acts as a central hub for routing and managing requests. It integrates various functionalities such as caching, rate limiting, authentication, and logging to ensure secure and efficient communication between services. The gateway is built using Node.js and leverages powerful middleware and utilities for scalable and maintainable development.

## Project Structure
```
/API Gateway
  /Config
    config.js          # Centralized configuration for the project
    routes.js          # Route definitions
  /NodeModules          # External dependencies
  /Src
    /Cache
      CacheHandler.js   # Manages application caching logic
      RedisClient.js    # Redis connection and operations
    /Database
      db.js             # Database connection setup
    /middlewares
      cors.js           # Cross-Origin Resource Sharing middleware
      errorHandler.js   # Centralized error handling middleware
      GeneralRateLimiter.js # Generic rate limiter for all requests
      ipRateLimiter.js  # Rate limiter based on IP address
      jwtAuth.js        # JWT authentication middleware
      requestMiddleware.js  # Custom request interceptors
      responseTransformer.js # Response formatting middleware
      StrictRateLimiter.js   # Advanced rate limiting for specific cases
    /models
      RefreshToken.js   # Model for managing refresh tokens
      User.js           # User schema for authentication
    /routes
      complaintRoutes.js # Handles complaint-related routes
      proxy.js          # Proxy handler for API requests
      userRoutes.js     # Handles user-related routes
    /service
      ipTrackingService.js # Service for tracking IP-related data
    /utils               # Utility functions and helpers
  /logs
    combined.log        # Combined log for all requests
    error.log           # Error-specific logs
  authHelper.js         # Authentication helper utilities
  jwtHelper.js          # JWT token-related utilities
  logger.js             # Logging utilities (e.g., Winston)
  /tests                # Contains test files
  .env                  # Environment variables
  error.log             # Error log file
  package-lock.json     # Dependency lock file
  package.json          # Project metadata and dependencies
  README.md             # Project documentation
  server.js             # Main entry point of the application
```

## Features
- **Centralized Configuration**: Simplified management of app settings via `config.js`.
- **Middleware Integration**: Essential middlewares for rate limiting, error handling, CORS, JWT authentication, and request-response transformation.
- **Database Management**: Seamless integration with a database through `db.js`.
- **Caching**: Redis-based caching for faster data retrieval.
- **Logging**: Detailed request and error logs via `logger.js`.
- **Authentication**: Secure JWT-based authentication with refresh token management.
- **Rate Limiting**: General, IP-based, and strict rate-limiting strategies for enhanced security.
- **Proxy Support**: Efficient handling of API proxy requests.

## Prerequisites
- **Node.js**: v14.x or above
- **Redis**: Installed and running
- **Database**: Compatible with the configuration in `db.js`
- **npm**: Installed to manage dependencies

## Installation
1. Clone the repository:
```bash
git clone <repository_url>
cd API-Gateway
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Create a `.env` file based on the template provided and add your values for:
     - Database credentials
     - Redis configuration
     - JWT secret keys

4. Start the server:
```bash
npm start
```

## Testing
Run tests using the following command:
```bash
npm test
```

## Logs
Logs are maintained in the `/logs` directory:
- `combined.log`: Records all requests
- `error.log`: Tracks application errors

## Contributions
Feel free to contribute by submitting issues or pull requests.

## Contact
For any queries, reach out at: [asgarovravan@gmail.com](mailto:asgarovravan@gmail.com)
