import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function AddDates(props: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await props.params;

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      users: {
        where: {
          isCreator: true,
        },
      },
    },
  });

  if (!event) {
    return notFound();
  }

  return <div>Add Dates</div>;
}
