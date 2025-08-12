import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Platform = 'instagram' | 'linkedin' | 'facebook';

interface PostRequest {
  platform: Platform;
  content: string;
  accessToken: string;
  imageUrl?: string;
}

// Demo image URL for posts
const DEMO_IMAGE_URL = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=800&fit=crop&auto=format';

// Mock posting functions for each platform
const postToInstagram = async (content: string, accessToken: string, imageUrl?: string) => {
  console.log('[Instagram Post] Posting to Instagram Basic Display API');
  console.log('[Instagram Post] Content:', content.slice(0, 100) + '...');
  console.log('[Instagram Post] Image:', imageUrl || DEMO_IMAGE_URL);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `ig_${Date.now()}`,
    permalink: `https://www.instagram.com/p/demo_${Date.now()}/`,
    timestamp: new Date().toISOString(),
  };
};

const postToLinkedIn = async (content: string, accessToken: string, imageUrl?: string) => {
  console.log('[LinkedIn Post] Posting to LinkedIn API');
  console.log('[LinkedIn Post] Content:', content.slice(0, 100) + '...');
  console.log('[LinkedIn Post] Image:', imageUrl || DEMO_IMAGE_URL);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: `li_${Date.now()}`,
    permalink: `https://www.linkedin.com/posts/demo_${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
};

const postToFacebook = async (content: string, accessToken: string, imageUrl?: string) => {
  console.log('[Facebook Post] Posting to Facebook Graph API');
  console.log('[Facebook Post] Content:', content.slice(0, 100) + '...');
  console.log('[Facebook Post] Image:', imageUrl || DEMO_IMAGE_URL);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return {
    id: `fb_${Date.now()}`,
    permalink: `https://www.facebook.com/demo/posts/${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
};

export async function POST(req: Request) {
  try {
    const { platform, content, accessToken, imageUrl } = (await req.json()) as PostRequest;

    if (!platform || !content || !accessToken) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, content, accessToken' },
        { status: 400 }
      );
    }

    if (!['instagram', 'linkedin', 'facebook'].includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    console.log(`[Social Post] Posting to ${platform}`);

    let result;
    switch (platform) {
      case 'instagram':
        result = await postToInstagram(content, accessToken, imageUrl);
        break;
      case 'linkedin':
        result = await postToLinkedIn(content, accessToken, imageUrl);
        break;
      case 'facebook':
        result = await postToFacebook(content, accessToken, imageUrl);
        break;
      default:
        throw new Error('Unsupported platform');
    }

    console.log(`[Social Post] Successfully posted to ${platform}:`, result.id);

    return NextResponse.json({
      success: true,
      platform,
      post: result,
      message: `Successfully posted to ${platform}!`,
    });
  } catch (error) {
    console.error('[Social Post] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to post to social media',
        message: String(error)
      },
      { status: 500 }
    );
  }
}

