import type { Accessor } from 'solid-js';
import type { SolidTinyTableColumn } from '../types/core';
import type { RowData } from '../types/row';
import type { CoreRow } from './column';

export interface CellContext<TData extends RowData, TValue> {
  getValue: Accessor<TValue>;
  row: CoreRow<TData, TValue>;
  column: SolidTinyTableColumn<TData, TValue>;
}
