import { describe, expect, it } from 'vitest';
import { createColumnHelper } from '../../src';
import { makeHeaders } from '../../src/core/headers';

type Person = {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
    country: string;
  };
};

const h = createColumnHelper<Person>();

describe('Headers', () => {
  it('make headers', () => {
    const columns = [
      h.accessor('name', {
        header: 'Name',
      }),
      h.accessor('age', {
        header: 'Age',
      }),
      h.group({
        header: 'Address',
        columns: [
          h.accessor('address.street', {
            header: 'Street',
          }),
          h.accessor('address.city', {
            header: 'City',
          }),
          h.accessor('address.country', {
            header: 'Country',
          }),
        ],
      }),
    ];
    const headers = makeHeaders(columns);
    expect(headers.length).toBe(2);
    expect(headers[0].length).toBe(3);
    expect(headers[1].length).toBe(3);
  });
});
