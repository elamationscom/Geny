import { Platform } from './types';

export interface PostResult {
  success: boolean;
  platform: Platform;
  post?: {
    id: string;
    permalink: string;
    timestamp: string;
  };
  error?: string;
  message?: string;
}

/**
 * Posts content to a social media platform
 */
export async function postToSocialMedia(
  platform: Platform,
  content: string,
  accessToken: string,
  imageUrl?: string
): Promise<PostResult> {
  try {
    console.log(`[Social Post] Attempting to post to ${platform}`);
    
    const response = await fetch('/api/social/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform,
        content,
        accessToken,
        imageUrl,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to post');
    }

    console.log(`[Social Post] Successfully posted to ${platform}:`, result.post?.id);
    return result;
  } catch (error) {
    console.error(`[Social Post] Error posting to ${platform}:`, error);
    return {
      success: false,
      platform,
      error: String(error),
      message: `Failed to post to ${platform}. Please try again.`,
    };
  }
}

/**
 * Posts the same content to multiple platforms
 */
export async function postToMultiplePlatforms(
  platforms: Platform[],
  content: string,
  accessTokens: Record<Platform, string>,
  imageUrl?: string
): Promise<PostResult[]> {
  console.log(`[Social Post] Posting to ${platforms.length} platforms:`, platforms);
  
  const promises = platforms.map(platform => 
    postToSocialMedia(platform, content, accessTokens[platform], imageUrl)
  );
  
  const results = await Promise.allSettled(promises);
  
  return results.map((result, index) => {
    const platform = platforms[index];
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        success: false,
        platform,
        error: String(result.reason),
        message: `Failed to post to ${platform}`,
      };
    }
  });
}

/**
 * Demo image URL for posts that don't have an image
 */
export const getDemoImageUrl = () => {
  const demoImages = [
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=800&fit=crop&auto=format', // Social media abstract
    'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=800&fit=crop&auto=format', // Content creation
    'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&h=800&fit=crop&auto=format', // Digital marketing
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=800&fit=crop&auto=format', // Analytics
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=800&fit=crop&auto=format', // Teamwork
  ];
  
  return demoImages[Math.floor(Math.random() * demoImages.length)];
};

