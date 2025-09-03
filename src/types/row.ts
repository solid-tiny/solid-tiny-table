/** biome-ignore-all lint/suspicious/noExplicitAny: any */
export type RowData = object;

export type AccessorFn<TData extends RowData, TValue = unknown> = (
  originalRow: TData
) => TValue;
