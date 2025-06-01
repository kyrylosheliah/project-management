import { config } from 'dotenv';

config();

import { execSync } from 'child_process';

const port = process.env.VITE_PORT || 4173; // fallback default Vite preview port

execSync(`npm run preview -- --port ${port}`, { stdio: 'inherit' });
