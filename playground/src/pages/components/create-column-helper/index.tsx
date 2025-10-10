import { createSignal, For } from 'solid-js';
import { list, uid } from 'solid-tiny-utils';
import { createColumnHelper } from '../../../../../src';
import { createTable } from '../../../../../src/core/table';
import { Button } from '../../../components/button';

type Person = {
  name: string;
  age: number;
  email: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
};

function genPersons(): Person[] {
  return list(10).map(() => ({
    name: uid(8),
    age: Math.floor(Math.random() * 100),
    email: `${uid(8)}@example.com`,
    address: {
      street: `${uid(8)} St`,
      city: `${uid(8)} City`,
      country: `${uid(8)} Country`,
    },
  }));
}

export default function CreateColumnHelper() {
  const helper = createColumnHelper<Person>();

  const columns = [
    helper.accessor('name', {
      header: () => <strong>Name</strong>,
      meta: {
        info: 'The name of the person',
      },
    }),
    helper.display({
      id: 'info',
      header: () => <strong>Info</strong>,
      cell: (info) =>
        `${info.row.original.name} (${info.row.original.age} years old)`,
    }),
    helper.accessor('age', {
      header: () => <strong>Age</strong>,
    }),
    helper.accessor('email', {
      header: () => <strong>Email</strong>,
    }),
    helper.group({
      header: 'address',
      columns: [
        helper.accessor('address.street', {
          header: () => <strong>Street</strong>,
        }),
        helper.accessor('address.city', {
          header: () => <strong>City</strong>,
        }),
        helper.accessor('address.country', {
          header: () => <strong>Country</strong>,
        }),
      ],
    }),
  ];

  const [data, setData] = createSignal<Person[]>(genPersons());

  const table = createTable({
    data,
    columns,
  });

  return (
    <div>
      <Button onClick={() => setData(genPersons())}>Change Data</Button>
      <table class="b-solid w-full border border-gray-200">
        <thead>
          <For each={table.headers()}>
            {(header) => (
              <tr>
                <For each={header}>
                  {(cell) => (
                    <td
                      class="b b-solid b-gray-200"
                      classList={{
                        'bg-gray-100': cell.isLeaf,
                      }}
                      colSpan={cell.colSpan}
                      rowSpan={cell.rowSpan}
                    >
                      {cell.renderHeader()}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.rows()}>
            {(row) => (
              <tr>
                <For each={row.getCells()}>
                  {(cell) => {
                    return <td>{cell.renderCell()}</td>;
                  }}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}
