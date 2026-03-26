# Instagram Graph API Setup Guide

## Overview
To display real Instagram profile pictures in the Follower Tracker, you'll need an Instagram Graph API access token. This guide walks you through the process.

## Step-by-Step Setup

### 1. Create a Meta (Facebook) Developer Account
- Go to [Meta for Developers](https://developers.facebook.com)
- Click "Get Started"
- Fill in your information and create an account
- Verify your email

### 2. Create an App
- Go to [My Apps](https://developers.facebook.com/apps)
- Click "Create App"
- Choose **Consumer** as the app type
- Fill in app details:
  - **App Name**: Something like "Instagram Follower Tracker"
  - **App Contact Email**: Your email
  - **Purpose**: Select appropriate category
- Click "Create App"

### 3. Add Instagram Graph API
- In your app dashboard, click "Add Product"
- Find "Instagram Graph API" and click "Set Up"
- This adds the product to your app

### 4. Set Up Instagram Basic Display
- Go to **Settings → Basic** (in left sidebar)
- Copy your **App ID** and **App Secret** (keep these safe!)
- Go to **Products → Instagram Basic Display**
- Click "Create a New App Role" or use existing if you have one

### 5. Get Your Access Token

#### Option A: Using Instagram App (Quick, for Personal Use)
1. Go to **Roles → Test Users** in your app
2. Click "Add Instagram Test User"
3. Accept the invitation on your Instagram account
4. Go back to **Roles → Test Users**
5. Click "Generate Token" next to your test user
6. Copy the generated token

#### Option B: Using Meta App (Production, Requires Approval)
1. Submit your app for app review at **App Roles → App Center**
2. Provide app description and privacy policy
3. Meta reviews your request (can take a few days)
4. Once approved, you can get user access tokens from real users

### 6. Get a Long-Lived Token (60 days)
The default token expires quickly. To get a long-lived token:

```bash
# Terminal/Command Prompt
curl -i -X GET "https://graph.instagram.com/access_token?grant_type=ig_refresh_token&access_token=YOUR_SHORT_LIVED_TOKEN"
```

Or use this endpoint:
```
https://graph.instagram.com/access_token?grant_type=ig_refresh_token&access_token=YOUR_SHORT_LIVED_TOKEN
```

### 7. Add Your Token to Follower Tracker

1. Open the Follower Tracker app
2. Click the **"+ Add Token"** button in the navbar
3. Paste your long-lived access token
4. Click **Confirm**
5. Done! Profile pictures will now load from Instagram

## Token Permissions

Your token needs these permissions:
- `instagram_basic` - Read basic profile data
- `instagram_graph_user_picture` - Read profile pictures

These are automatically requested when you create the token.

## Troubleshooting

### ❌ "Invalid access token" error
- Token has expired → Generate a new long-lived token
- Token is invalid → Copy it again carefully
- Check you're using a long-lived token (60 days), not short-lived (1 hour)

### ❌ Profile pictures still not loading
- Token might not have proper permissions
- Instagram API might be rate-limiting requests
- Try uploading your data again

### ❌ "Instagram App Not Set Up" error
- Make sure you've added Instagram Graph API to your app
- Check app is in development mode (not production yet)

## Security Notes

✅ **Safe to Use:**
- Your token is stored **only in your browser**, never sent to external servers
- Data processing is 100% client-side
- You can revoke the token anytime from Meta Developer Dashboard

⚠️ **Best Practices:**
- Keep your App Secret private
- Use long-lived tokens (60 days)
- Revoke tokens if you no longer need them
- Don't share your token with anyone

## Revoking Your Token

If you want to stop using the API:

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Navigate to your app
3. Go to **Settings → Basic**
4. Scroll to "App Roles"
5. Remove test users or reset app

Or in the app:
- Click **"+ Add Token"** button (now shows "✓ API Token")
- Click **"Skip"** to disconnect
- The token will be removed from your browser

## Next Steps

1. Complete the setup above
2. Get your access token
3. Add it to the Follower Tracker
4. Upload your Instagram data
5. See real profile pictures! 🎉

Need help? Check:
- [Instagram Graph API Docs](https://developers.instagram.com/docs/instagram-graph-api)
- [Meta Developer Community](https://www.facebook.com/groups/developers)
