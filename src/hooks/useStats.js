import cloneDeep from "clone-deep";

import useFirebaseRef from "./useFirebaseRef";
import { BASE_RATING, modes } from "../util";

/** Listen to statistics for a given user, with filled in default null values. */
function useStats(userId) {
  const [value, loading] = useFirebaseRef(
    userId ? `/userStats/${userId}` : null
  );
  if (loading) {
    return [value, loading];
  }
  const stats = cloneDeep(value) ?? {};
  for (const mode of Object.keys(modes)) {
    stats[mode] ??= {};
    stats[mode].rating ??= BASE_RATING;
  }
  return [stats, loading];
}

export default useStats;
