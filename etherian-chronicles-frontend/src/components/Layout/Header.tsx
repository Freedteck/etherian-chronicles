import { useState } from "react";
import { Link } from "react-router-dom";
import { Book, Crown, Users, Scroll, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectButton, darkTheme, useActiveAccount } from "thirdweb/react";
import { client, wallets } from "@/lib/utils";
import { etherlinkTestnet } from "thirdweb/chains";
import ThemeToggle from "../ui/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const account = useActiveAccount();

  const navigation = [
    { name: "Stories", href: "/stories", icon: Book },
    { name: "Proposals", href: "/proposals", icon: Scroll },
    { name: "Community", href: "/community", icon: Users },
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
            {account && (
              <Link
                to={`/profile/${account.address}`}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <Crown className="h-4 w-4" />
                <span className="font-medium">Profile</span>
              </Link>
            )}
          </nav>
          <ThemeToggle />

          {/* Connect Button */}
          <div className="hidden md:flex items-center space-x-4">
            <ConnectButton
              client={client}
              wallets={wallets}
              accountAbstraction={{
                chain: etherlinkTestnet, // replace with the chain you want
                sponsorGas: true,
              }}
              connectModal={{ size: "compact" }}
              theme={darkTheme({
                colors: {
                  secondaryIconHoverColor: "hsl(240, 6%, 94%)",
                  secondaryIconColor: "hsl(251, 4%, 50%)",
                  connectedButtonBg: "hsl(217.2 32.6% 17.5%)",
                  connectedButtonBgHover: "hsl(231, 11%, 12%)",
                  accentButtonText: "hsl(240, 7%, 94%)",
                  modalBg: "hsl(228, 12%, 8%)",
                  primaryButtonBg: "hsl(270, 60%, 45%)",
                  primaryButtonText: "hsl(0, 0%, 100%)",
                },
              })}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
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
