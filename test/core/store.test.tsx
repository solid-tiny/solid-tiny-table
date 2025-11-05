/** biome-ignore-all lint/style/noNonNullAssertion: delete */
import { fireEvent, render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { createTable } from "../../src";

function StoreComponent() {
  const table = createTable({
    data: [],
    columns: [],
    store: { custom: "test", customObj: { nested: "nested value" } },
  });

  const [state, { setState }] = table.ctx;

  return (
    <div>
      <div data-testid="store-custom">{JSON.stringify(state.custom)}</div>
      <div data-testid="store-customObj">{JSON.stringify(state.customObj)}</div>
      <button
        data-testid="update-btn"
        onClick={() =>
          setState({
            custom: "changed",
            customObj: { nested: "changed value" },
          })
        }
        type="button"
      >
        Change Custom
      </button>
      <button
        data-testid="delete-btn"
        onClick={() =>
          setState({
            custom: undefined!,
            customObj: undefined!,
          })
        }
        type="button"
      >
        Change Custom
      </button>
    </div>
  );
}

describe("Store", () => {
  it("create table with custom store", () => {
    const { getByTestId } = render(() => <StoreComponent />);

    const custom = getByTestId("store-custom");
    const customObj = getByTestId("store-customObj");

    expect(custom.textContent).toBe('"test"');
    expect(customObj.textContent).toBe('{"nested":"nested value"}');

    fireEvent.click(getByTestId("update-btn"));
    expect(custom.textContent).toBe('"changed"');
    expect(customObj.textContent).toBe('{"nested":"changed value"}');

    fireEvent.click(getByTestId("delete-btn"));
    expect(custom.textContent).toBeFalsy();
    expect(customObj.textContent).toBeFalsy();
  });
});
