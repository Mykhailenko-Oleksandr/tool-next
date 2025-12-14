📌 Project 🛠 ToolNext (Frontend side)
ToolNext is a web application for peer-to-peer tool rental. Users can publish their own tools, browse available listings, make bookings, leave reviews, and manage their personal profiles.

🧩 Technologies
Next.js 15 (App Router)

TypeScript

Tailwind CSS + CSS Modules

TanStack Query (React Query)

Formik + Yup

React Hot Toast

Zustand (if needed)

Dynamic import + next/image

Axios

OpenGraph metadata

Client/Server Components (split as required)

📦 Installation
bash
npm install
npm run dev
🔐 Routing
Public routes: /, /tools, /auth/login, /auth/register

Private routes: /profile, /tools/edit/[toolId], /tools/new, /tools/[toolId]/booking

Authorization checks are implemented at the component level to protect private routes.

📄 Forms & Validation
Formik + Yup — used for registration, login, tool creation/editing, and booking forms

Toast notifications — for errors, success messages, and status updates

Loaders — displayed during requests, submissions, and dynamic imports

🧠 State Management
TanStack Query — for data fetching, caching, and synchronization

Zustand — for local state management (when required)

📸 SEO & OpenGraph
Each page implements generateMetadata

OpenGraph tags are added to improve link previews when sharing

🧪 Swagger (TODO)
Swagger documentation for backend endpoints will be added separately
