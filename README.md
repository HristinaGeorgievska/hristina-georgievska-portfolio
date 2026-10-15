# Hristina Georgievska – Portfolio

Modern, responsive artist & design portfolio website built with Vite, React, TypeScript, and Tailwind CSS, integrated with Contentful CMS.

## 🚀 Features

- **Portfolio & Collections**: Curated showcases of artwork, collections, and detailed views.
- **Contentful CMS Integration**: Dynamic content management for collections, artworks, and biographies.
- **Responsive & Modern UI**: Built with Tailwind CSS and Radix UI / shadcn-ui components.
- **SEO & Performance**: Optimized images, metadata via `react-helmet-async`, and client-side caching with TanStack Query.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) / Radix UI
- **CMS**: [Contentful](https://www.contentful.com/)
- **State & Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Testing**: [Vitest](https://vitest.dev/) + React Testing Library

## 📦 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Olinkkt/hristina-georgievska-portfolio.git
   cd hristina-georgievska-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   VITE_CONTENTFUL_SPACE_ID=your_space_id
   VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be running at `http://localhost:3000/`.

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the project for production.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint across the codebase.
- `npm test`: Runs unit tests with Vitest.
