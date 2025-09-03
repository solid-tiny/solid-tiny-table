import { createState } from 'solid-tiny-context';
import { access, createWatch, type MaybeAccessor } from 'solid-tiny-utils';
import type { ColumnDef } from '../types/column-def';
import type { SolidTinyTableInstance } from '../types/core';
import type { RowData } from '../types/row';
import { makeRows } from './column';
import { makeHeaders } from './headers';

export function createTable<TData extends RowData>(params: {
  data: MaybeAccessor<TData[]>;
  // biome-ignore lint/suspicious/noExplicitAny: any
  columns: MaybeAccessor<ColumnDef<TData, any>[]>;
}): SolidTinyTableInstance<TData> {
  const ctx = createState({
    state: () => ({
      data: access(params.data),
      columns: access(params.columns),
    }),
    getters: {
      headers() {
        return makeHeaders(this.state.columns);
      },
      rows() {
        return makeRows(this.state.data, this.state.columns);
      },
    },
  });

  createWatch(
    () => [access(params.data), access(params.columns)] as const,
    ([data, columns]) => {
      ctx[1].setState({
        data,
        columns,
      });
    },
    { defer: true }
  );

  return {
    headers: () => ctx[0].headers,
    rows: () => ctx[0].rows,
  };
}
