import { isFn } from "solid-tiny-utils";
import type {
  AccessorFnColumnDef,
  AccessorKeyColumnDef,
  DisplayColumnDef,
  GroupColumnDef,
  IdentifiedColumnDef,
} from "../types/column-def";
import type { AccessorFn, RowData } from "../types/row";
import type { DeepKeys, DeepValue } from "../types/utils";

export type ColumnHelper<TData extends RowData> = {
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never,
  >(
    accessor: TAccessor,
    column: TAccessor extends AccessorFn<TData>
      ? DisplayColumnDef<TData, TValue>
      : IdentifiedColumnDef<TData, TValue>
  ) => TAccessor extends AccessorFn<TData>
    ? AccessorFnColumnDef<TData, TValue>
    : AccessorKeyColumnDef<TData, TValue>;
  display: (
    column: DisplayColumnDef<TData>
  ) => DisplayColumnDef<TData, unknown>;
  group: (column: GroupColumnDef<TData>) => GroupColumnDef<TData, unknown>;
};

export function createColumnHelper<
  TData extends RowData,
>(): ColumnHelper<TData> {
  return {
    accessor: (accessor, column) => {
      return isFn(accessor)
        ? ({
            ...column,
            accessorFn: accessor,
            // biome-ignore lint/suspicious/noExplicitAny: any
          } as any)
        : {
            ...column,
            accessorKey: accessor,
          };
    },
    display: (column) => column,
    group: (column) => column,
  };
}
