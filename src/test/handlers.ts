import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/customers", () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "John Doe",
      },
      {
        id: 2,
        name: "Jane Smith",
      },
    ]);
  }),
];
