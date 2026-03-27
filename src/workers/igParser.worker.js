/* eslint-disable no-restricted-globals */
// Web Worker: parse Instagram JSON off main thread.
// Receives: { files: { [filename]: jsonText }, unfollowedUsernames: string[] }
// Returns: { ok: true, result: { notFollowingBack, fans, closeFriends, pendingRequests, recentlyUnfollowed } }
// Each list is an array of usernames (strings).

const normalizeUsername = (u) => (u || "").toString().trim().replace(/^@/, "");

const extractUsernameFromItem = (item) => {
  if (!item || typeof item !== "object") return null;
  const fromStringList = item?.string_list_data?.[0]?.value;
  if (fromStringList) return fromStringList;
  if (item?.title) return item.title;
  if (item?.username) return item.username;
  return null;
};

const extractTimestampFromItem = (item) => {
  if (!item || typeof item !== "object") return null;
  const rawTimestamp = item?.string_list_data?.[0]?.timestamp || item?.timestamp;
  if (!rawTimestamp) return null;

  if (typeof rawTimestamp === 'number') {
    // Instagram export timestamps are typically seconds since epoch.
    const ms = rawTimestamp < 1e12 ? rawTimestamp * 1000 : rawTimestamp;
    return new Date(ms).toISOString();
  }
  if (typeof rawTimestamp === 'string' && /^[0-9]+$/.test(rawTimestamp)) {
    const num = Number(rawTimestamp);
    const ms = num < 1e12 ? num * 1000 : num;
    return new Date(ms).toISOString();
  }
  if (typeof rawTimestamp === 'string') {
    const parsed = new Date(rawTimestamp);
    if (!Number.isNaN(parsed.valueOf())) return parsed.toISOString();
  }

  return null;
};

const buildUsernameListFromArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  const out = [];
  const seen = new Set();
  for (const item of arr) {
    const username = normalizeUsername(extractUsernameFromItem(item));
    if (!username || seen.has(username)) continue;

    const timestamp = extractTimestampFromItem(item);

    seen.add(username);
    out.push({ username, timestamp });
  }
  return out;
};

self.onmessage = (event) => {
  try {
    const { files, unfollowedUsernames } = event.data || {};
    if (!files || typeof files !== "object") {
      self.postMessage({ ok: false, error: "Missing files payload." });
      return;
    }

    const followersRaw = files["followers_1.json"];
    const followingRaw = files["following.json"];

    if (!followersRaw || !followingRaw) {
      self.postMessage({
        ok: false,
        error:
          'Invalid folder. Please upload your Instagram folder named "followers_and_following" that contains `followers_1.json` and `following.json`.',
      });
      return;
    }

    const followersData = JSON.parse(followersRaw);
    const followingData = JSON.parse(followingRaw);

    const followerUsers = buildUsernameListFromArray(followersData);
    const followingUsers = buildUsernameListFromArray(
      followingData?.relationships_following
    );

    const followerSet = new Set(followerUsers.map((u) => u.username));
    const followingSet = new Set(followingUsers.map((u) => u.username));
    const unfollowedSet = new Set((unfollowedUsernames || []).map(normalizeUsername));

    const fans = followerUsers.filter((u) => !followingSet.has(u.username));
    const notFollowingBack = followingUsers.filter(
      (u) => !followerSet.has(u.username) && !unfollowedSet.has(u.username)
    );


    // Optional lists
    let closeFriends = [];
    if (files["close_friends.json"]) {
      const closeFriendsData = JSON.parse(files["close_friends.json"]);
      closeFriends = buildUsernameListFromArray(
        closeFriendsData?.relationships_close_friends
      );
    }

    let pendingRequests = [];
    if (files["pending_follow_requests.json"]) {
      const pendingData = JSON.parse(files["pending_follow_requests.json"]);
      pendingRequests = buildUsernameListFromArray(
        pendingData?.relationships_follow_requests_sent
      );
    }

    let recentlyUnfollowed = [];
    if (files["recently_unfollowed_profiles.json"]) {
      const unfData = JSON.parse(files["recently_unfollowed_profiles.json"]);
      recentlyUnfollowed = buildUsernameListFromArray(
        unfData?.relationships_unfollowed_users
      );
    }

    // Parse-but-ignore (requirements)
    if (files["recent_follow_requests.json"]) JSON.parse(files["recent_follow_requests.json"]);
    if (files["removed_suggestions.json"]) JSON.parse(files["removed_suggestions.json"]);

    self.postMessage({
      ok: true,
      result: {
        notFollowingBack,
        fans,
        closeFriends,
        pendingRequests,
        recentlyUnfollowed,
      },
    });
  } catch (e) {
    console.error('igParser.worker parsing error', e);
    self.postMessage({
      ok: false,
      error: `Error parsing folder files. Ensure they are the correct JSON format: ${e?.message || e}`,
    });
  }
};

