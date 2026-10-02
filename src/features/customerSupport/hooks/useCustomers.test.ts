import { http, HttpResponse } from "msw";
import { renderHook, waitFor } from "@testing-library/react";
import { TestQueryProvider } from "@/test/testUtils";
import { server } from "@/test/server";
import { useCustomers } from "./useCustomers";

describe("useCustomers", () => {
  it("loads customers successfully", async () => {
    const { result } = renderHook(() => useCustomers(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.customers).toEqual([
      {
        id: 1,
        name: "John Doe",
      },
      {
        id: 2,
        name: "Jane Smith",
      },
    ]);

    expect(result.current.error).toBeNull();
  });

  it("handles API errors", async () => {
    server.use(
      http.get("/api/customers", () => {
        return HttpResponse.json(
          { message: "Failed to fetch customers." },
          { status: 500 },
        );
      }),
    );

    const { result } = renderHook(() => useCustomers(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.customers).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch customers.");
  });
});
