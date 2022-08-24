type ChangePageFn = (newPath: string) => Promise<void>;

type SelectUnitFn = (unit: string) => void;

export { ChangePageFn, SelectUnitFn };
