import ChooseUserDates from "./_ChooseUserDates";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getJSDateFromStr } from "@/lib/utilities";
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

  //   if (!event.allowOthersToPropose) {
  //     return notFound();
  //   }

  const jsDates = event.users[0].availableDates.map(getJSDateFromStr);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <ChooseUserDates setDates={jsDates} eventId={eventId} />
    </div>
  );
}
