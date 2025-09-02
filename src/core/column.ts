import type { AccessorFn, RowData } from '../types/row';

export type CoreColumn<TData extends RowData, TValue> = {
  id: string;
  accessorFn?: AccessorFn<TData, TValue>;
};
