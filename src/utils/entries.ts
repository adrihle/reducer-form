const entries = <T extends object>(entries: T) => {
  return Object.entries(entries) as [keyof T, T[keyof T]][];
};

export { entries };
