# Soccer Planner Next.js App
Soccer planner app: manage groups and matches (users create groups, group managers create matches in the groups, group members view matches and join matches)

# Technologies
Next.js + Neon DB + Drizzle ORM + React + Tailwind

# Architectural Guidelines
 - **Service layer**: implement app business logic, used by the RESTful API and Server Actions
 - Use **modular design**: split the app into selft-contained components, to avoid complex files with too much code
  - **Auth**: JWT tokens + bcrypt
  - **Database**: Neon DB + Drizzle ORM

# User Interface Guidelines
  - Implement modern UI, responsive design, use server-rendered components in Next.js
  - Use server-side rendering, only use client components for browser interaction and forms
