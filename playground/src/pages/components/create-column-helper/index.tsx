import { createColumnHelper } from '../../../../../src';

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

export default function CreateColumnHelper() {
  const helper = createColumnHelper<Person>();

  const columns = [
    helper.accessor('name', {
      cell: 'eee',
    }),
    helper.accessor('age', {
      cell: 'fff',
    }),
    helper.accessor('email', {
      cell: 'ggg',
    }),
    helper.accessor('address', {
      cell: 'hhh',
    }),
  ];

  // biome-ignore lint/suspicious/noConsole: log
  console.log(columns);

  return <div>check console please</div>;
}
