import { createState } from 'solid-tiny-context';
import { access, createWatch, type MaybeAccessor } from 'solid-tiny-utils';
import type { ColumnDef } from '../types/column-def';
import type { SolidTinyTableInstance, TableStore } from '../types/core';
import type { RowData } from '../types/row';
import { makeRows } from './column';
import { makeHeaders } from './headers';

export function createTable<
  TData extends RowData,
  TStore extends TableStore,
>(params: {
  data: MaybeAccessor<TData[]>;
  // biome-ignore lint/suspicious/noExplicitAny: any
  columns: MaybeAccessor<ColumnDef<TData, any>[]>;
  store?: TStore;
}): SolidTinyTableInstance<TData, TStore> {
  const ctx = createState({
    state: () =>
      ({
        ...params.store,
        data: access(params.data),
        columns: access(params.columns),
        // biome-ignore lint/suspicious/noExplicitAny: I can't figure out a better way right now
      }) as any,
    getters: {
      headers() {
        return makeHeaders(this.state.columns);
      },
      rows() {
        return makeRows(this.state.data, this.state.headers);
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
    }
  );

  return {
    headers: () => ctx[0].headers,
    rows: () => ctx[0].rows,
    ctx: [ctx[0], ctx[1]],
  };
}
