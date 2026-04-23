/*
Context Description:
- Manages global authentication state across the app.
- Stores the current user, their role (buyer/seller), and provides functions for login, signup, and logout.
- Also handles persisting auth state (so users stay logged in on refresh) and is used to protect routes like 
Profile and Seller Dashboard.
*/