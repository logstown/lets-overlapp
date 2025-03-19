import prisma from "@/lib/prisma";
import CopyLink from "./_CopyLink";
import { notFound } from "next/navigation";
import _ from "lodash";
import { format } from "date-fns";

export default async function EventResults(props: { params: Promise<{ userId: string }> }) {
  const { userId } = await props.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      event: {
        include: {
          users: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  if (!user || (!user.isCreator && !user.event.allowOthersToViewResults)) {
    return notFound();
  }
  const { event } = user;
  const { users } = event;

  console.log(users);

  //   const flatDates = users.map((user) => user.availableDates).flat();
  const dates = _.chain(users)
    .map((user) => user.availableDates)
    .flatten()
    .uniqBy((date) => date.toISOString())
    .sortBy((date) => date.toISOString())
    .value();

  console.log(dates);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4">
        <CopyLink id={event.id} />
        <div className="overflow-x-auto h-[500px]">
          <table className="table table-pin-rows table-pin-cols">
            <thead>
              <tr>
                <th></th>
                {dates.map((date) => (
                  <th key={date.toISOString()}>{format(date, "MMM d")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  {dates.map((date) => (
                    <td key={date.toISOString()}>
                      {user.availableDates.some((d) => d.toISOString() === date.toISOString()) ? "Yes" : "No"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {/* <tfoot>
              <tr>
                <th></th>
                <td>Name</td>
                <td>Job</td>
                <td>company</td>
                <td>location</td>
                <td>Last Login</td>
                <td>Favorite Color</td>
                <th></th>
              </tr>
            </tfoot> */}
          </table>
        </div>
        {/* <CopyLink id={userId} isResults /> */}
      </div>
    </div>
  );
}
