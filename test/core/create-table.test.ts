import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";
import { createTable } from "../../src";

describe("createTable", () => {
  it("should create a table instance", () => {
    createRoot((dispose) => {
      const table = createTable({
        data: [{ name: "John" }],
        columns: [{ accessorKey: "name" }],
      });

      expect(table).toBeDefined();
      expect(table.ctx).toBeDefined();
      expect(table.headers).toBeDefined();
      expect(table.rows).toBeDefined();
      expect(table.rows()[0].table).toHaveProperty("ctx");
      expect(table.rows()[0].table).toHaveProperty("headers");
      expect(table.rows()[0].table).toHaveProperty("rows");
      expect(table.rows()[0].index).toBe(0);
      dispose();
    });
  });
});
