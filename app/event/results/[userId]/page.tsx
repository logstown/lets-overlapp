import prisma from "@/lib/prisma";
import CopyLink from "./_CopyLink";
import { notFound } from "next/navigation";

export default async function EventResults(props: { params: Promise<{ userId: string }> }) {
  const { userId } = await props.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      event: true,
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4">
        <CopyLink id={user?.event.id} />
        <CopyLink id={userId} isResults />
      </div>
    </div>
  );
}
