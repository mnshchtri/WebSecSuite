# WebSecSuite

A modern web security testing and analysis suite built with TypeScript, React, and Express.

## Features

- Modern web interface built with Next.js and Material-UI
- Real-time security testing capabilities
- API-driven architecture for extensibility
- Responsive design with Tailwind CSS
- Dark/light theme support
- TypeScript for type safety

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Material-UI
- **Backend**: Node.js, Express.js, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **State Management**: React Hook Form
- **Validation**: Zod

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- TypeScript
- PostgreSQL (optional, depending on your setup)

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd WebSecSuite
```

2. Install dependencies:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory with your configuration.

4. Start the development servers:
```bash
# Start client (in client directory)
npm run dev

# Start server (in server directory)
npm start
```

## Project Structure

```
WebSecSuite/
├── client/              # Frontend application
│   ├── public/         # Static assets
│   ├── src/           # Source code
│   └── package.json   # Client dependencies
├── server/             # Backend application
│   ├── routes/        # API routes
│   └── package.json   # Server dependencies
└── README.md          # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to the open-source community for all the amazing tools and libraries used in this project
- Special thanks to the TypeScript and React teams for their excellent documentation and support
