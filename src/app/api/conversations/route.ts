import { conversations } from "@/features/conversations/data/conversations";

export async function GET() {
  return Response.json(conversations);
}
