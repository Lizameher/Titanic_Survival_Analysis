
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ship, BookOpen, Database, Sparkles, ChevronLeft, ChevronRight, Home } from 'lucide-react';

const Navigation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Data Exploration', path: '/explore', icon: <Database className="h-5 w-5" /> },
    { name: 'Feature Engineering', path: '/features', icon: <Sparkles className="h-5 w-5" /> },
    { name: 'Models & Results', path: '/models', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Prediction', path: '/predict', icon: <Ship className="h-5 w-5" /> },
  ];

  return (
    <div 
      className={`bg-ocean-dark text-white transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-ocean-light/20">
        {!collapsed && (
          <div className="flex items-center">
            <Ship className="h-6 w-6 mr-2 text-nautical-gold" />
            <h1 className="text-xl font-semibold">Titanic ML</h1>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCollapsed(!collapsed)} 
          className={`text-white hover:bg-ocean p-1 ${collapsed ? 'mx-auto' : ''}`}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      
      <nav className="flex-1 pt-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <Button 
                  variant={location.pathname === item.path ? "secondary" : "ghost"} 
                  className={`w-full justify-start ${
                    location.pathname === item.path 
                      ? 'bg-ocean text-white hover:bg-ocean/90' 
                      : 'text-ocean-light hover:bg-ocean hover:text-white'
                  } ${collapsed ? 'px-2' : ''}`}
                >
                  <div className={`${collapsed ? 'mx-auto' : 'mr-2'}`}>{item.icon}</div>
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-ocean-light/20 text-center text-xs text-ocean-light/70">
        {!collapsed && "Titanic Survival Analysis © 2025"}
      </div>
    </div>
  );
};

export default Navigation;
