export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  return [initialValue, () => {}]
}
