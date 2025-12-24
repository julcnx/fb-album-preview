// Generate all unique combinations of exactly 5 photos
export function getAllCombinations(arr: string[]): string[][] {
  const results: string[][] = [];
  if (arr.length < 5) return results;
  combine(arr, 5, 0, [], results);
  return results;
}

function combine(
  arr: string[],
  size: number,
  start: number,
  path: string[],
  results: string[][]
) {
  if (path.length === size) {
    results.push([...path]);
    return;
  }
  for (let i = start; i < arr.length; i++) {
    path.push(arr[i]);
    combine(arr, size, i + 1, path, results);
    path.pop();
  }
}
