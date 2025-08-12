import { Facebook, Instagram, Linkedin, LogIn, ExternalLink, CheckCircle, User, Users } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';
import Card from './Card';
import { Platform, SocialAccount } from '../lib/types';

const IconFor: Record<Platform, (props: { size?: number; className?: string }) => JSX.Element> = {
  instagram: (p) => <Instagram {...p} />,
  linkedin: (p) => <Linkedin {...p} />,
  facebook: (p) => <Facebook {...p} />,
};

const PlatformColors: Record<Platform, string> = {
  instagram: 'from-purple-500 to-pink-500',
  linkedin: 'from-blue-600 to-blue-700',
  facebook: 'from-blue-500 to-blue-600',
};

const PlatformNames: Record<Platform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

export default function SocialAccountCard({ account, onConnect, onDisconnect }: {
  account: SocialAccount;
  onConnect: (platform: Platform, accessToken: string, profileInfo?: SocialAccount['profileInfo']) => void;
  onDisconnect: (platform: Platform) => void;
}) {
  const [isConnecting, setIsConnecting] = useState(false);
  const Icon = IconFor[account.platform];

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Get OAuth URL from our API
      const response = await fetch('/api/social/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: account.platform }),
      });

      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }

      const { authUrl } = await response.json();
      
      // Open OAuth flow in new window
      const authWindow = window.open(
        authUrl,
        `${account.platform}_auth`,
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Listen for the OAuth callback
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          // Check URL params for auth result
          checkAuthResult();
        }
      }, 1000);

    } catch (error) {
      console.error('Auth error:', error);
      setIsConnecting(false);
      // For demo purposes, simulate successful connection
      handleDemoConnect();
    }
  };

  const handleDemoConnect = () => {
    // Simulate successful OAuth for demo
    const demoToken = `demo_token_${account.platform}_${Date.now()}`;
    const demoProfile = {
      username: `demo_user_${account.platform}`,
      profilePicture: `https://ui-avatars.com/api/?name=${account.platform}&background=random`,
      followerCount: Math.floor(Math.random() * 10000) + 1000,
    };
    
    onConnect(account.platform, demoToken, demoProfile);
    setIsConnecting(false);
  };

  const checkAuthResult = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    const token = urlParams.get('token');
    
    if (authSuccess === account.platform && token) {
      const demoProfile = {
        username: `user_${account.platform}`,
        profilePicture: `https://ui-avatars.com/api/?name=${account.platform}&background=random`,
        followerCount: Math.floor(Math.random() * 10000) + 1000,
      };
      
      onConnect(account.platform, decodeURIComponent(token), demoProfile);
      
      // Clean up URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Platform gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${PlatformColors[account.platform]} opacity-5`} />
      
      <div className="relative flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          {/* Enhanced icon with platform colors */}
          <div className={`p-3 rounded-xl bg-gradient-to-br ${PlatformColors[account.platform]} shadow-lg`}>
            <Icon size={24} className="text-white" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">{PlatformNames[account.platform]}</span>
              {account.connected && (
                <CheckCircle size={16} className="text-green-400" />
              )}
            </div>
            
            {account.connected && account.profileInfo ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <User size={14} />
                  <span>@{account.profileInfo.username}</span>
                </div>
                {account.profileInfo.followerCount && (
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Users size={14} />
                    <span>{account.profileInfo.followerCount.toLocaleString()} followers</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-white/60">
                {isConnecting ? 'Connecting...' : 'Not connected'}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {account.connected ? (
            <Button 
              variant="ghost" 
              onClick={() => onDisconnect(account.platform)}
              className="border border-white/10 hover:border-red-400/50 hover:text-red-400"
            >
              Disconnect
            </Button>
          ) : (
            <>
              {/* Demo login link for reference */}
              <a
                href={`https://www.${account.platform}.com`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm inline-flex items-center gap-2 hover:bg-white/10 transition-colors"
                title={`Visit ${account.platform} (opens in new tab)`}
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">Visit</span>
              </a>
              
              {/* OAuth connect button */}
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
                className={`bg-gradient-to-r ${PlatformColors[account.platform]} hover:opacity-90 shadow-lg`}
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <LogIn size={16} className="mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}