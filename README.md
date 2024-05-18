# Asset Manager - Frontend

This is the frontend of Asset Manager Web Application. This project uses React, TypeScript, TailwindCSS, ShadCN, and Vite.

## Project repositories

- [Backend](https://github.com/chamikacme/asset-manager-backend) - Nest.js
- [Frontend](https://github.com/chamikacme/asset-manager-frontend) - React.js
- [Public Site](https://github.com/chamikacme/asset-manager-public) - HTML/ CSS

## Prerequisites

Before you begin, ensure you have the following tools installed on your machine:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- npm: This comes with Node.js, but make sure it's up-to-date by running `npm install -g npm`.

## Getting Started

To get started with this project, follow the steps below:

### Clone the Repository

```bash
git clone git@github.com:chamikacme/asset-manager-frontend.git
```

### Change Directory

```bash
cd asset-manager-frontend
```

### Add Environmental Variables

Copy the `sample.env` file and rename it to `.env`. Update the `.env` file with required variables.
 

### Install Dependencies

```bash
npm install
```

## Running the Application

After the installation is complete, you can run the development server with the following command:

```bash
npm run dev
```

This will start the development server, and you can view your React app at [http://localhost:5173](http://localhost:5173).

## Building for Production

To build the application for production, use the following command:

```bash
npm run build
```

This will generate a `dist` folder with optimized and minified production-ready code.

## Additional Commands

- `npm run lint`: Lint your code using ESLint.

## Folder Structure

```
asset-manager-frontend/
│
├── src/                  # Source code
│   ├── assets/       	  # Project assets
│   ├── components/       # React components
│   ├── layouts/          # App layouts
│   ├── lib/              # Globally used files
│   ├── pages/            # App pages
│   ├── routes/           # Route related files
│   ├── store/            # Zustand state store
│   ├── App.tsx           # Main App component
│   └── index.tsx         # Entry point
│
├── .gitignore            # Git ignore file
├── index.html            # HTML template
├── package.json          # Node.js package file
├── tsconfig.json         # TypeScript configuration
├── vite.config.js        # Vite configuration
└── README.md             # Project README file
```
