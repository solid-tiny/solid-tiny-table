import type { Accessor } from "solid-js";
import type {
  SolidTinyTableColumn,
  SolidTinyTableInstance,
} from "../types/core";
import type { RowData } from "../types/row";
import type { CoreRow } from "./column";

export type CellContext<TData extends RowData, TValue> = {
  getValue: Accessor<TValue>;
  row: CoreRow<TData, TValue>;
  column: SolidTinyTableColumn<TData, TValue>;
  // biome-ignore lint/suspicious/noExplicitAny: for any
  table: SolidTinyTableInstance<TData, any>;
};
