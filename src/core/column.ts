import type { JSX } from 'solid-js/jsx-runtime';
import { isFn, isString } from 'solid-tiny-utils';
import type {
  AccessorColumnDef,
  ColumnDef,
  DisplayColumnDef,
} from '../types/column-def';
import type { AccessorFn, RowData } from '../types/row';
import { getValueAtPath } from '../utils/object';

export type CoreColumn<TData extends RowData, TValue> = {
  accessorFn?: AccessorFn<TData, TValue>;
};

export type CoreRow<TData extends RowData, TValue = unknown> = {
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
  columnDef: DisplayColumnDef<TData, TValue> | AccessorColumnDef<TData, TValue>
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
      return columnDef.cell({ value: getValue });
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
  columnDefs: ColumnDef<TData, TValue>[]
) {
  const getLeafColumns = (colDefs: ColumnDef<TData, TValue>[]) => {
    const leafColumns: (
      | DisplayColumnDef<TData, TValue>
      | AccessorColumnDef<TData, TValue>
    )[] = [];
    for (const column of colDefs) {
      if ('columns' in column && column.columns?.length) {
        leafColumns.push(...getLeafColumns(column.columns));
      } else {
        leafColumns.push(column);
      }
    }
    return leafColumns;
  };

  const leafColumns = getLeafColumns(columnDefs);
  const rows: CoreRow<TData>[] = data.map((rowData) => {
    const cells: CoreCell<TData>[] = leafColumns.map((column) => {
      const col = normalizeColumnDef(rowData, column);
      return { getValue: col.getValue, renderCell: col.render };
    });
    return { getCells: () => cells };
  });
  return rows;
}
