import type { Accessor } from 'solid-js';
import type { CoreCell, CoreColumn, CoreRow } from '../core/column';
import type { CoreHeader } from '../core/headers';
import type { RowData } from './row';

export type SolidTinyTableInstance<TData extends RowData> = {
  rows: Accessor<SolidTinyTableRow<TData, unknown>[]>;
  headers: () => SolidTinyTableHeader<TData, unknown>[][];
};

export interface SolidTinyTableColumn<TData extends RowData, TValue = unknown>
  extends CoreColumn<TData, TValue> {}

export interface SolidTinyTableHeader<TData extends RowData, TValue>
  extends CoreHeader<TData, TValue> {}

export interface SolidTinyTableCell<TData extends RowData, TValue>
  extends CoreCell<TData, TValue> {}

export interface SolidTinyTableRow<TData extends RowData, TValue = unknown>
  extends CoreRow<TData, TValue> {}
