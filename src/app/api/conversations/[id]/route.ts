import { conversations } from "@/features/conversations/data/conversations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { id } = await context.params;

  const conversation = conversations.find((conv) => conv.id === Number(id));

  if (!conversation) {
    return Response.json(
      { message: "Conversation not found" },
      { status: 404 },
    );
  }

  return Response.json(conversation);
}
