import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Platform = 'instagram' | 'linkedin' | 'facebook';

// Mock token exchange for demo purposes
const exchangeCodeForToken = async (platform: Platform, code: string): Promise<string> => {
  // In a real implementation, you would exchange the code for an access token
  // You would use the client_secret from environment variables like:
  // const clientSecret = getClientSecret(platform);
  // and make an actual API call to exchange the code
  
  console.log(`[Social Callback] Exchanging code for ${platform} token`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return `demo_access_token_${platform}_${Date.now()}`;
};

// Helper function to get client secrets from environment variables
const getClientSecret = (platform: Platform): string => {
  switch (platform) {
    case 'instagram':
      return process.env.INSTAGRAM_CLIENT_SECRET || '';
    case 'linkedin':
      return process.env.LINKEDIN_CLIENT_SECRET || '';
    case 'facebook':
      return process.env.FACEBOOK_CLIENT_SECRET || '';
    default:
      return '';
  }
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    console.error('[Social Callback] OAuth error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app?auth_error=${error}`);
  }

  if (!code || !state) {
    console.error('[Social Callback] Missing code or state');
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app?auth_error=missing_params`);
  }

  try {
    // Extract platform from state
    const platform = state.split('_')[0] as Platform;
    
    if (!['instagram', 'linkedin', 'facebook'].includes(platform)) {
      throw new Error('Invalid platform in state');
    }

    // Exchange code for access token
    const accessToken = await exchangeCodeForToken(platform, code);

    console.log(`[Social Callback] Successfully authenticated ${platform}`);

    // In a real app, you would store the token securely
    // For demo, we'll just redirect with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app?auth_success=${platform}&token=${encodeURIComponent(accessToken)}`
    );
  } catch (error) {
    console.error('[Social Callback] Token exchange error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app?auth_error=token_exchange_failed`);
  }
}

