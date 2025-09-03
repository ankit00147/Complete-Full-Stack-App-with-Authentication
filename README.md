Complete Full-Stack App with Authentication


auth-fullstack/                # Main project folder
│
├── server.js                  # Express backend main file
├── package.json               # Backend dependencies & scripts
├── package-lock.json
├── .env                       # Backend environment variables (JWT_SECRET, PORT)
│
├── client/                    # React frontend (Vite)
│   ├── index.html
│   ├── package.json           # Frontend dependencies & scripts
│   ├── vite.config.js
│   └── src/                   # React source code
│       ├── main.jsx           # App entrypoint
│       ├── App.jsx            # Routes setup
│       │
│       ├── api.js             # Helper for fetch with JWT
│       │
│       ├── auth/              # Auth context for global login state
│       │   └── AuthContext.jsx
│       │
│       ├── components/        # Reusable components
│       │   └── ProtectedRoute.jsx
│       │
│       ├── pages/             # Pages (each is a route)
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Dashboard.jsx
│       │
│       └── assets/            # (optional) images, css files, logos
│
└── README.md                  # (optional) project notes





