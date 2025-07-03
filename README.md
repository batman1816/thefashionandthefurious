# The Fashion & Furious

A modern e-commerce application for fashion products built with React, TypeScript, and Supabase.

## Features

- Product catalog with categories (Drivers, Teams, F1 Classic)
- Shopping cart functionality
- Order management system
- Admin panel for product and order management
- Make.com webhook integration
- Responsive design with dark theme

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deployment Options

#### Using cPanel (Static Hosting)

1. Run `npm run build` to create production files
2. Upload the contents of the `dist` folder to your cPanel public_html directory
3. The app will work as a static site

#### Using Lovable

Simply open [Lovable](https://lovable.dev/projects/edf11749-980c-4e34-8127-db5c619dd984) and click on Share -> Publish.

#### Using Vercel/Netlify

The app can be deployed directly to Vercel or Netlify by connecting your GitHub repository.

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/pages` - Page components
  - `/context` - React context providers
  - `/hooks` - Custom React hooks
  - `/integrations` - External service integrations
  - `/utils` - Utility functions
- `/public` - Static assets
- `/supabase` - Database migrations and functions

## Admin Access

Admin panel is available at `/admin` with password: `yUsrA@#$2618`

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- Supabase (Database & Storage)
- React Router
- Vite (Build tool)

## Custom Domain

You can connect a custom domain by navigating to Project > Settings > Domains and clicking Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
