/** biome-ignore-all lint/suspicious/noExplicitAny: e */
import type { JSX } from "solid-js/jsx-runtime";
import { isArray, isFn, isString } from "solid-tiny-utils";
import type { ColumnDef } from "../types/column-def";
import type {
  SolidTinyTableColumn,
  SolidTinyTableHeader,
  SolidTinyTableInstance,
} from "../types/core";
import type { RowData } from "../types/row";
import { getValueAtPath } from "../utils/object";

export type CoreHeader<TData extends RowData, TValue> = {
  rowSpan: number;
  colSpan: number;
  depth: number;
  renderHeader: () => JSX.Element;
  column: SolidTinyTableColumn<TData, TValue>;
  isLeaf: boolean;
};

export type HeaderContext<TData extends RowData, TValue> = {
  /**
   * An instance of a column.
   */
  column: SolidTinyTableColumn<TData, TValue>;
  /**
   * An instance of a header.
   */
  header: SolidTinyTableHeader<TData, TValue>;
  table: SolidTinyTableInstance<TData, any>;
};

function getMaxDepth<T extends RowData, V>(cols: ColumnDef<T, V>[]): number {
  return cols.reduce((depth, col) => {
    if ("columns" in col && col.columns) {
      return Math.max(depth, 1 + getMaxDepth(col.columns));
    }
    return Math.max(depth, 1);
  }, 0);
}

function countLeaves<T extends RowData, V>(cols: ColumnDef<T, V>[]): number {
  return cols.reduce((count, col) => {
    if ("columns" in col && col.columns) {
      return count + countLeaves(col.columns);
    }
    return count + 1;
  }, 0);
}

export function makeHeaders<TData extends RowData>(
  columnDefs: ColumnDef<TData, any>[],
  table: SolidTinyTableInstance<TData, any>
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
      const isGroup =
        "columns" in col && isArray(col.columns) && col.columns.length > 0;

      const h = {} as CoreHeader<TData, any>;

      h.column = {
        columnDef: col,
      };
      h.renderHeader = () => {
        if (isString(col.header)) {
          return col.header;
        }
        if (isFn(col.header)) {
          return col.header({
            header: h,
            column: h.column,
            table,
          });
        }

        return getValueAtPath(col, "accessorKey") || "-";
      };

      if (isGroup) {
        // biome-ignore lint/style/noNonNullAssertion: is safe here
        const leafCount = countLeaves(col.columns!);
        h.depth = depth;
        h.colSpan = leafCount;
        h.rowSpan = 1;
        h.isLeaf = false;
        headers[depth].push(h);

        // biome-ignore lint/style/noNonNullAssertion: is safe here
        traverse(col.columns!, depth + 1, headers[depth]);
      } else {
        h.depth = depth;
        h.colSpan = 1;
        h.rowSpan = maxDepth - depth;
        h.isLeaf = true;
        headers[depth].push(h);
      }
    }
  }

  traverse(columnDefs, 0);

  return headers;
}
