import type { CoreColumn } from '../core/column';
import type { CoreHeader } from '../core/headers';
import type { RowData } from './row';

export type SolidTinyTableInstance<TData extends RowData> = {
  getAllRows: () => TData[];
};

export interface SolidTinyTableColumn<TData extends RowData, TValue = unknown>
  extends CoreColumn<TData, TValue> {}

export interface SolidTinyTableHeader<TData extends RowData, TValue>
  extends CoreHeader<TData, TValue> {}
