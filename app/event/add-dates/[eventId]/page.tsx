import ChooseDates from "@/components/ChooseDates";
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

  const setDates = event.allowOthersToPropose ? undefined : event.users[0].availableDates;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <ChooseDates setDates={setDates} eventId={eventId} />
    </div>
  );
}
