import type { JSX } from 'solid-js/jsx-runtime';
import { isFn, isString } from 'solid-tiny-utils';
import type {
  AccessorColumnDef,
  ColumnDef,
  DisplayColumnDef,
} from '../types/column-def';
import type { RowData } from '../types/row';
import { getValueAtPath } from '../utils/object';
import type { CoreHeader } from './headers';

export type CoreColumn<TData extends RowData, TValue> = {
  columnDef: ColumnDef<TData, TValue>;
};

export type CoreRow<TData extends RowData, TValue = unknown> = {
  original: TData;
  getCells: () => CoreCell<TData, TValue>[];
};

export type CoreCell<_TData extends RowData, TValue = unknown> = {
  getValue: () => TValue;
  renderCell: () => JSX.Element;
};

export type NormalizedColumnDef<TValue = unknown> = {
  getValue: () => TValue;
  render: () => JSX.Element;
};

export function normalizeColumnDef<TData extends RowData, TValue>(
  data: TData,
  columnDef: DisplayColumnDef<TData, TValue> | AccessorColumnDef<TData, TValue>,
  row: CoreRow<TData, TValue>
): NormalizedColumnDef<TValue> {
  const getValue = () => {
    if ('accessorKey' in columnDef && isString(columnDef.accessorKey)) {
      return getValueAtPath(data, columnDef.accessorKey) as TValue;
    }
    if ('accessorFn' in columnDef && isFn(columnDef.accessorFn)) {
      return columnDef.accessorFn(data) as TValue;
    }
    return '' as TValue;
  };

  const render = () => {
    if (isString(columnDef.cell)) {
      return columnDef.cell;
    }

    if (isFn(columnDef.cell)) {
      return columnDef.cell({ getValue, row, column: { columnDef } });
    }

    return getValue();
  };

  return {
    getValue,
    render,
  };
}

export function makeRows<TData extends RowData, TValue>(
  data: TData[],
  headers: CoreHeader<TData, TValue>[][]
) {
  type NoneGroupDef =
    | DisplayColumnDef<TData, TValue>
    | AccessorColumnDef<TData, TValue>;
  const getLeafColumns = () => {
    const leafColumns = headers
      .flat()
      .filter((h) => h.isLeaf)
      .map((h) => h.column.columnDef as NoneGroupDef);
    return leafColumns;
  };

  const leafColumns = getLeafColumns();
  const rows: CoreRow<TData>[] = data.map((rowData) => {
    const row = {} as CoreRow<TData, TValue>;
    const cells: CoreCell<TData, TValue>[] = leafColumns.map((column) => {
      const col = normalizeColumnDef(rowData, column, row);
      return { getValue: col.getValue, renderCell: col.render };
    });
    row.getCells = () => cells;
    row.original = rowData;
    return row;
  });
  return rows;
}
