import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Platform = 'instagram' | 'linkedin' | 'facebook';

interface AuthUrls {
  [key: string]: {
    authUrl: string;
    scope: string;
    clientId: string;
  };
}

// OAuth configuration for each platform
const getAuthConfig = (): AuthUrls => ({
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    scope: 'user_profile,user_media',
    clientId: process.env.INSTAGRAM_CLIENT_ID || 'demo_client_id',
  },
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scope: 'w_member_social',
    clientId: process.env.LINKEDIN_CLIENT_ID || 'demo_client_id',
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    scope: 'pages_manage_posts,pages_read_engagement',
    clientId: process.env.FACEBOOK_CLIENT_ID || 'demo_client_id',
  },
});

export async function POST(req: Request) {
  try {
    const { platform } = (await req.json()) as { platform: Platform };
    
    if (!platform || !['instagram', 'linkedin', 'facebook'].includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    const config = getAuthConfig()[platform];
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/social/callback`;
    const state = `${platform}_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // Build OAuth URL
    const authUrl = new URL(config.authUrl);
    authUrl.searchParams.set('client_id', config.clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', config.scope);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('state', state);

    console.log(`[Social Auth] Generated auth URL for ${platform}:`, authUrl.toString());

    return NextResponse.json({
      authUrl: authUrl.toString(),
      state,
      platform,
    });
  } catch (error) {
    console.error('[Social Auth] Error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

