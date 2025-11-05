import type { Accessor } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import type { CoreCell, CoreColumn, CoreRow } from "../core/column";
import type { CoreHeader } from "../core/headers";
import type { ColumnDef } from "./column-def";
import type { RowData } from "./row";

export type TableStore = {
  [key: string]: unknown;
  data?: never;
  columns?: never;
  rows?: never;
  headers?: never;
};

export type SolidTinyTableInstance<
  TData extends RowData,
  TStore extends TableStore,
> = {
  rows: Accessor<SolidTinyTableRow<TData, unknown>[]>;
  headers: () => SolidTinyTableHeader<TData, unknown>[][];
  ctx: [
    Readonly<
      {
        data: TData[];
        columns: ColumnDef<TData, unknown>[];
      } & Omit<TStore, "data" | "columns" | "rows" | "headers">
    >,
    {
      setState: SetStoreFunction<
        {
          data: TData[];
          columns: ColumnDef<TData, unknown>[];
        } & Omit<TStore, "data" | "columns" | "rows" | "headers">
      >;
    },
  ];
};

export interface SolidTinyTableColumn<TData extends RowData, TValue = unknown>
  extends CoreColumn<TData, TValue> {}

export interface SolidTinyTableHeader<TData extends RowData, TValue>
  extends CoreHeader<TData, TValue> {}

export interface SolidTinyTableCell<TData extends RowData, TValue>
  extends CoreCell<TData, TValue> {}

export interface SolidTinyTableRow<TData extends RowData, TValue = unknown>
  extends CoreRow<TData, TValue> {}
