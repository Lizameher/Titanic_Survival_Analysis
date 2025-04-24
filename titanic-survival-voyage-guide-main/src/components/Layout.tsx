
import { ReactNode } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-6 overflow-auto bg-gradient-to-b from-sky-50 to-blue-100">
        {children}
      </main>
    </div>
  );
};

export default Layout;
