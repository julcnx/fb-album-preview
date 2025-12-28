// src/utils/heroPermutations.ts
import { kPermutations } from "./permutations";

// Accepts selectedPhotos as array of { id, url }, heroCombosSelected as array of JSON stringified id arrays
// Return both images and heroIds for each arrangement
export function heroPermutations(
  selectedPhotos: { id: number; url: string }[],
  heroCombosSelected: string[]
): { images: string[]; heroIds: number[] }[] {
  const results: { images: string[]; heroIds: number[] }[] = [];
  for (const key of heroCombosSelected) {
    const heroPair: number[] = JSON.parse(key);
    const rest = selectedPhotos.filter((p) => !heroPair.includes(p.id));
    // Both hero orders
    for (const order of [heroPair, [heroPair[1], heroPair[0]]]) {
      const orderUrls = order.map(
        (id) => selectedPhotos.find((p) => p.id === id)?.url || ""
      );
      // All permutations of the rest
      const restPerms = kPermutations(rest, 3);
      for (const perm of restPerms) {
        results.push({
          images: [...orderUrls, ...perm.map((p) => p.url)],
          heroIds: order,
        });
      }
    }
  }
  return results;
}
