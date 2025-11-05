/** biome-ignore-all lint/suspicious/noExplicitAny: any */
/** biome-ignore-all lint/complexity/noBannedTypes: e */
/** biome-ignore-all lint/correctness/noUnusedVariables: e */
/** biome-ignore-all lint/suspicious/noEmptyInterface: e */
import type { CellContext } from "../core/cell";
import type { HeaderContext } from "../core/headers";
import type { AccessorFn, RowData } from "./row";

export type IdIdentifier<TData extends RowData, TValue> = {
  id: string;
  header?: StringOrTemplateHeader<TData, TValue>;
};

export type StringHeaderIdentifier = {
  header: string;
  id?: string;
};

type ColumnIdentifiers<TData extends RowData, TValue> =
  | IdIdentifier<TData, TValue>
  | StringHeaderIdentifier;

// biome-ignore lint/style/useConsistentTypeDefinitions: can be extend by users
export interface ColumnMeta<TData extends RowData, TValue> {}

export type ColumnDefTemplate<TProps extends object> =
  | string
  | ((props: TProps) => any);

export type StringOrTemplateHeader<TData extends RowData, TValue> =
  | string
  | ColumnDefTemplate<HeaderContext<TData, TValue>>;

export type ColumnDefBase<TData extends RowData, TValue = unknown> = {
  cell?: ColumnDefTemplate<CellContext<TData, TValue>>;
  meta?: ColumnMeta<TData, TValue>;
};

export interface IdentifiedColumnDef<TData extends RowData, TValue = unknown>
  extends ColumnDefBase<TData, TValue> {
  id?: string;
  header?: StringOrTemplateHeader<TData, TValue>;
}

export type DisplayColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>;

interface GroupColumnDefBase<TData extends RowData, TValue = unknown>
  extends ColumnDefBase<TData, TValue> {
  columns?: ColumnDef<TData, any>[];
}

export type GroupColumnDef<
  TData extends RowData,
  TValue = unknown,
> = GroupColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>;

export type ColumnDef<TData extends RowData, TValue = unknown> =
  | DisplayColumnDef<TData, TValue>
  | GroupColumnDef<TData, TValue>
  | AccessorColumnDef<TData, TValue>;

export interface AccessorFnColumnDefBase<
  TData extends RowData,
  TValue = unknown,
> extends ColumnDefBase<TData, TValue> {
  accessorFn: AccessorFn<TData, TValue>;
}

export type AccessorFnColumnDef<
  TData extends RowData,
  TValue = unknown,
> = AccessorFnColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>;

export interface AccessorKeyColumnDefBase<
  TData extends RowData,
  TValue = unknown,
> extends ColumnDefBase<TData, TValue> {
  id?: string;
  accessorKey: (string & {}) | keyof TData;
}

export type AccessorKeyColumnDef<
  TData extends RowData,
  TValue = unknown,
> = AccessorKeyColumnDefBase<TData, TValue> &
  Partial<ColumnIdentifiers<TData, TValue>>;

export type AccessorColumnDef<TData extends RowData, TValue = unknown> =
  | AccessorKeyColumnDef<TData, TValue>
  | AccessorFnColumnDef<TData, TValue>;
