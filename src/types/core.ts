import type { Accessor } from 'solid-js';
import type { CoreColumn, CoreRow } from '../core/column';
import type { CoreHeader } from '../core/headers';
import type { RowData } from './row';

export type SolidTinyTableInstance<TData extends RowData> = {
  rows: Accessor<CoreRow<TData, unknown>[]>;
  headers: () => SolidTinyTableHeader<TData, unknown>[][];
};

export interface SolidTinyTableColumn<TData extends RowData, TValue = unknown>
  extends CoreColumn<TData, TValue> {}

export interface SolidTinyTableHeader<TData extends RowData, TValue>
  extends CoreHeader<TData, TValue> {}
