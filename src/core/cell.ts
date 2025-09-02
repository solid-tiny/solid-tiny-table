import type { Accessor } from 'solid-js';
import type { SolidTinyTableColumn } from '../types/core';
import type { RowData } from '../types/row';

export interface CellContext<TData extends RowData, TValue> {
  column: SolidTinyTableColumn<TData, TValue>;
  value: Accessor<TValue>;
}
