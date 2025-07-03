import { createRoot } from 'react-dom/client';
import './global.less';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(<App />);
