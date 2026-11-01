import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-navy-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center text-white shadow-md shadow-brand-accent/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-brand-text dark:text-white">
                TrustChain
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-brand-accent/10 text-brand-accent dark:bg-brand-accent/20">
                AI
              </span>
            </div>
            <p className="text-[10px] text-brand-muted dark:text-slate-400 -mt-0.5 font-medium tracking-wide">
              Document Authentication
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-brand-accent dark:hover:text-white transition-colors">
            Capabilities
          </a>
          <a href="#how-it-works" className="hover:text-brand-accent dark:hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#security" className="hover:text-brand-accent dark:hover:text-white transition-colors">
            Trust & Security
          </a>
          <Link to="/verify/public" className="hover:text-brand-accent dark:hover:text-white transition-colors">
            Public Verifier
          </Link>
        </nav>

        {/* Actions & Theme */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            title="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/app/dashboard')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Dashboard
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
