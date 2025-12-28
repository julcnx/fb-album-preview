// src/utils/permutations.ts

// Generic k-permutations
export function kPermutations<T>(arr: T[], k: number): T[][] {
  const results: T[][] = [];
  function permute(path: T[], used: boolean[]) {
    if (path.length === k) {
      results.push([...path]);
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(arr[i]);
      permute(path, used);
      path.pop();
      used[i] = false;
    }
  }
  permute([], Array(arr.length).fill(false));
  return results;
}
