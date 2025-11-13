# Portfolio Website

A modern, responsive portfolio website built with React 19, TypeScript, and Vite.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **CSS Modules** - Scoped styling
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **Radix UI** - Accessible UI components
- **EmailJS** - Email service integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
npm install
```

### Email Configuration

The contact form uses EmailJS to send emails. To enable this feature:

1. Create a `.env` file in the root directory
2. Add your EmailJS credentials:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

3. See [EMAILJS_SETUP.md](./EMAILJS_SETUP.md) for detailed setup instructions

**Note:** The contact form will show an error if EmailJS is not configured. You can use the `.env.example` file as a reference.

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

Build the static site for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

## Project Structure

```
├── src/
│   ├── components/       # React components
│   │   └── ui/          # Reusable UI components
│   ├── data/            # Portfolio data and content
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── styles/          # Global styles and CSS tokens
│   ├── App.tsx          # Root application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── index.html          # HTML template
└── package.json        # Dependencies and scripts
```

## Features

- ✨ Modern glassmorphism design
- 🎨 Animated gradient elements
- 📱 Fully responsive
- 🌙 Dark/light mode support
- ♿ Accessible components
- 🚀 Optimized performance
- 📊 Interactive charts
- 💬 WhatsApp integration
- 📧 Contact form with EmailJS integration

## Deployment

The built static files can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Cloudflare Pages
- etc.

Simply deploy the contents of the `dist` directory after running `npm run build`.

## License

MIT
