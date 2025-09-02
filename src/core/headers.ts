/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
/** biome-ignore-all lint/correctness/noUnusedVariables: <explanation> */
import type { ColumnDef } from '../types/column-def';
import type {
  SolidTinyTableColumn,
  SolidTinyTableHeader,
  SolidTinyTableInstance,
} from '../types/core';
import type { RowData } from '../types/row';

export type CoreHeader<TData, TValue> = {
  rowSpan: number;
  colSpan: number;
  depth: number;
};

export interface HeaderContext<TData, TValue> {
  /**
   * An instance of a column.
   */
  column: SolidTinyTableColumn<TData, TValue>;
  /**
   * An instance of a header.
   */
  header: SolidTinyTableHeader<TData, TValue>;
  /**
   * The table instance.
   */
  table: SolidTinyTableInstance<TData>;
}

function getMaxDepth<T, V>(cols: ColumnDef<T, V>[]): number {
  return cols.reduce((depth, col) => {
    if ('columns' in col && col.columns) {
      return Math.max(depth, 1 + getMaxDepth(col.columns));
    }
    return Math.max(depth, 1);
  }, 0);
}

function countLeaves<T, V>(cols: ColumnDef<T, V>[]): number {
  return cols.reduce((count, col) => {
    if ('columns' in col && col.columns) {
      return count + countLeaves(col.columns);
    }
    return count + 1;
  }, 0);
}

export function makeHeaders<TData extends RowData>(
  columnDefs: ColumnDef<TData, any>[]
): CoreHeader<TData, any>[][] {
  const headers: CoreHeader<TData, any>[][] = [];
  const maxDepth = getMaxDepth(columnDefs);
  function traverse(
    cols: ColumnDef<TData, any>[],
    depth: number,
    _parentRow: CoreHeader<TData, any>[] = []
  ) {
    if (!headers[depth]) {
      headers[depth] = [];
    }

    for (const col of cols) {
      const isGroup = 'columns' in col && Array.isArray(col.columns);

      if (isGroup) {
        // biome-ignore lint/style/noNonNullAssertion: is safe here
        const leafCount = countLeaves(col.columns!);
        const cell: CoreHeader<TData, any> = {
          depth,
          colSpan: leafCount,
          rowSpan: 1, // group 只占一行
        };
        headers[depth].push(cell);

        // biome-ignore lint/style/noNonNullAssertion: is safe here
        traverse(col.columns!, depth + 1, headers[depth]);
      } else {
        // 叶子列
        const cell: CoreHeader<TData, any> = {
          depth,
          colSpan: 1,
          rowSpan: maxDepth - depth, // 向下撑满
        };
        headers[depth].push(cell);
      }
    }
  }

  traverse(columnDefs, 0);

  return headers;
}
