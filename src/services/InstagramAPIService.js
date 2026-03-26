/**
 * Instagram Graph API Service
 * Fetches real profile pictures and user data using Instagram Graph API
 */

const INSTAGRAM_GRAPH_API_BASE = 'https://graph.instagram.com/v18.0';

class InstagramAPIService {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  /**
   * Get user's profile picture and basic info
   * Requires: user_id (can be obtained from username lookup)
   */
  async getUserProfilePicture(username) {
    if (!this.accessToken) {
      throw new Error('Access token not provided');
    }

    try {
      // First, get user ID from username
      const igUserResponse = await fetch(
        `${INSTAGRAM_GRAPH_API_BASE}/ig_hashtag_search?user_id=${username}&fields=id&access_token=${this.accessToken}`
      );

      if (!igUserResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await igUserResponse.json();
      return userData;
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      return null;
    }
  }

  /**
   * Get multiple users' profile data
   */
  async getUsersProfileData(userIds) {
    if (!this.accessToken) {
      throw new Error('Access token not provided');
    }

    try {
      const userDataMap = {};

      // Fetch user data for each ID
      for (const userId of userIds) {
        const response = await fetch(
          `${INSTAGRAM_GRAPH_API_BASE}/${userId}?fields=id,username,name,profile_picture_url&access_token=${this.accessToken}`
        );

        if (response.ok) {
          const data = await response.json();
          userDataMap[data.username] = {
            profilePictureUrl: data.profile_picture_url,
            name: data.name,
            username: data.username
          };
        }
      }

      return userDataMap;
    } catch (error) {
      console.error('Error fetching users profile data:', error);
      return {};
    }
  }

  /**
   * Validate access token
   */
  async validateToken() {
    if (!this.accessToken) {
      return false;
    }

    try {
      const response = await fetch(
        `${INSTAGRAM_GRAPH_API_BASE}/me?fields=id,username&access_token=${this.accessToken}`
      );
      return response.ok;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}

export default InstagramAPIService;
