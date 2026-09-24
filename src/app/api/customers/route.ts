import { CustomerResponse } from "@/features/conversations/types/api";
import { CustomerRow } from "@/features/conversations/types/database";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query<CustomerRow>(`
    SELECT id, name
    FROM customers
    ORDER BY name ASC
    `);

  const customers: CustomerResponse[] = result.rows.map((customer) => ({
    id: Number(customer.id),
    name: customer.name,
  }));

  return Response.json(customers);
}
