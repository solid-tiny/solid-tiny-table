import type { Accessor } from 'solid-js';
import type { RowData } from '../types/row';

export interface CellContext<_TData extends RowData, TValue> {
  value: Accessor<TValue>;
}
