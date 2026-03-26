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

const buildUsernameListFromArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  const out = [];
  const seen = new Set();
  for (const item of arr) {
    const username = normalizeUsername(extractUsernameFromItem(item));
    if (!username || seen.has(username)) continue;
    seen.add(username);
    out.push(username);
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

    const followerUsernames = buildUsernameListFromArray(followersData);
    const followingUsernames = buildUsernameListFromArray(
      followingData?.relationships_following
    );

    const followerSet = new Set(followerUsernames);
    const followingSet = new Set(followingUsernames);
    const unfollowedSet = new Set((unfollowedUsernames || []).map(normalizeUsername));

    const fans = followerUsernames.filter((u) => !followingSet.has(u));
    const notFollowingBack = followingUsernames.filter(
      (u) => !followerSet.has(u) && !unfollowedSet.has(u)
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
    self.postMessage({
      ok: false,
      error: "Error parsing folder files. Ensure they are the correct JSON format.",
    });
  }
};

