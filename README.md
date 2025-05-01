<p align="center">
  <img src="./src/assets/logos/logo.svg" width="100" />
</p>
<p align="center">
    <h1 align="center">Uevent</h1>
</p>
<p align="center">
    <em>Uevent: Your Ultimate Event Management Platform</em>
</p>
<p align="center">
    <img src="https://img.shields.io/github/license/maxkrv/uevent-fe?style=flat&color=0080ff" alt="license">
    <img src="https://img.shields.io/github/last-commit/maxkrv/uevent-fe?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
    <img src="https://img.shields.io/github/languages/top/maxkrv/uevent-fe?style=flat&color=0080ff" alt="repo-top-language">
    <img src="https://img.shields.io/github/languages/count/maxkrv/uevent-fe?style=flat&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
        <em>Developed with the software and tools below.</em>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">
    <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat&logo=Docker&logoColor=white" alt="Docker">
    <img src="https://img.shields.io/badge/Zod-000000.svg?style=flat&logo=Zod&logoColor=white" alt="Zod">
    <img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat&logo=Prettier&logoColor=white" alt="Prettier">
    <img src="https://img.shields.io/badge/axios-671ddf?style=flat&logo=axios&logoColor=white" alt="Axios">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind-CSS">
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=white" alt="React">
    <img src="https://img.shields.io/badge/Zustand-000000.svg?style=flat&logo=Zustand&logoColor=white" alt="Zustand">
    <img src="https://img.shields.io/badge/Day.js-FF5F5F.svg?style=flat&logo=Day.js&logoColor=white" alt="Day.js">
    <img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white" alt="PostCSS">
    <img src="https://img.shields.io/badge/React_Query-FF4154?style=flat&logo=react-query&logoColor=white" alt="React Query">
    <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat&logo=reacthookform&logoColor=white" alt="React Hook Form">
</p>
<hr>

## 🔗 Quick Links

> - [📋 Overview](#-overview)
> - [🚀 Tech Stack](#-tech-stack)
> - [💻 Getting Started](#-getting-started)
>   - [⚙️ Installation](#️-installation)
>   - [🕜 Running Uevent](#-running-uevent)
> - [📂 Project Structure](#-project-structure)
> - [🔧 Environment Variables](#-environment-variables)
> - [🤝 Contributing](#-contributing)
> - [📄 License](#-license)

---

## 📋 Overview

Uevent is a comprehensive event management platform that connects users with events and companies. The platform allows users to discover, follow, and purchase tickets for events, follow companies, and manage their event attendance. With a modern, intuitive interface, Uevent provides a seamless experience for event discovery, ticket purchasing, and social engagement around events.

### Key Features

- **User Authentication**: Secure login, registration, and account management
- **Event Discovery**: Browse and search for events with filtering options
- **Company Profiles**: Follow companies and stay updated with their events
- **Ticket Management**: Purchase and manage event tickets
- **Interactive Maps**: Location-based event discovery with Google Maps integration
- **User Profiles**: Personalized profiles with upcoming and past events
- **Notifications**: Real-time updates for followed events and companies
- **Responsive Design**: Seamless experience across all devices

---

## 🚀 Tech Stack

- **Core**: [TypeScript](https://www.typescriptlang.org/), [React](https://reactjs.org/), [React DOM](https://reactjs.org/docs/react-dom.html), [React Router DOM](https://reactrouter.com/), [Vite](https://vitejs.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Communication**: [Axios](https://axios-http.com/)
- **Data Fetching**: [React Query](https://tanstack.com/query/latest)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Date Handling**: [Day.js](https://day.js.org/)
- **Maps Integration**: [Google Maps API](https://developers.google.com/maps)
- **Development**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [PostCSS](https://postcss.org/), [Husky](https://typicode.github.io/husky/)
- **Containerization**: [Docker](https://www.docker.com/)

---

## 💻 Getting Started

### ⚙️ Installation

1. Clone the uevent-fe repository:

```sh
git clone https://github.com/maxkrv/uevent-fe
```

1. Change to the project directory:

```shellscript
cd uevent-fe
```

3. Install the dependencies:

```shellscript
npm install
```

### 🕜 Running Uevent

Use the following command to run Uevent in development mode:

```shellscript
npm run dev
```

The application will be available at `http://localhost:3000` (or the port specified in your Vite configuration).

### 📦 Building for Production

To build the application for production:

```shellscript
npm run build
```

To preview the production build locally:

```shellscript
npm run preview
```

## 📂 Project Structure

```plaintext
src/
├── assets/           # Static assets like logos
├── config/           # Application configuration
├── modules/          # Feature-based modules
│   ├── auth/         # Authentication related components
│   ├── company/      # Company related components
│   ├── event/        # Event related components
│   ├── ticket/       # Ticket related components
│   ├── user/         # User profile related components
│   └── ...
├── shared/           # Shared utilities, components, and hooks
│   ├── api/          # API client setup
│   ├── components/   # Reusable UI components
│   ├── guards/       # Route guards
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Library configurations
│   ├── store/        # Global state management
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   └── validators/   # Form validation schemas
└── styles/           # Global styles
```

## 🔧 Environment Variables

The application requires the following environment variables:

```plaintext
VITE_API_URL=your_api_url
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Create a `.env` file in the root directory and add these variables with your specific values.

## 🤝 Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Submit Pull Requests](https://github.com/maxkrv/uevent-fe/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/maxkrv/uevent-fe/discussions)**: Share your insights, provide feedback, or ask questions.
- **[Report Issues](https://github.com/maxkrv/uevent-fe/issues)**: Submit bugs found or log feature requests for Uevent.

<details>`<summary>`Contributing Guidelines`</summary>`

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a Git client.

```shellscript
git clone https://github.com/maxkrv/uevent-fe
```

3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.

```shellscript
git checkout -b new-feature-x
```

4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.

```shellscript
git commit -m 'Implemented new feature x.'
```

6. **Push to GitHub**: Push the changes to your forked repository.

```shellscript
git push origin new-feature-x
```

7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/maxkrv/uevent-fe/blob/main/LICENSE) file for details.

---
