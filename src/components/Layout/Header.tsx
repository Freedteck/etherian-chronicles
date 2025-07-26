import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Crown, Users, Scroll, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const navigation = [
    { name: 'Stories', href: '/stories', icon: Book },
    { name: 'Proposals', href: '/proposals', icon: Scroll },
    { name: 'Community', href: '/community', icon: Users }
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 group-hover:glow-primary transition-all duration-300">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-display font-semibold text-gradient-mystical">
                EtherianChronicle
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Forge Your Legend
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Connect Button */}
          <div className="hidden md:flex items-center space-x-4">
            {!isConnected ? (
              <Button 
                className="btn-mystical"
                onClick={() => setIsConnected(true)}
              >
                Connect
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="btn-mystical">
                    Connected
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border border-border shadow-xl">
                  <DropdownMenuItem asChild className="hover:bg-accent/20 focus:bg-accent/20 transition-colors border-b border-border/30 last:border-b-0">
                    <Link to="/profile" className="flex items-center px-3 py-2.5">
                      <Crown className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-accent/20 focus:bg-accent/20 transition-colors border-b border-border/30 last:border-b-0">
                    <Link to="/create" className="flex items-center px-3 py-2.5">
                      <Scroll className="h-4 w-4 mr-2" />
                      Create Story
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/80 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-2">
                <Link to="/create" onClick={() => setIsMenuOpen(false)}>
                  <Button className="btn-mystical w-full">
                    <Scroll className="h-4 w-4 mr-2" />
                    Create Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;