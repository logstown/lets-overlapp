import prisma from "@/lib/prisma";
import CopyLink from "./_CopyLink";
import { notFound } from "next/navigation";
import _, { groupBy } from "lodash";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { CheckIcon } from "lucide-react";
import AggregatedDates from "./_AggregatedDates";

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

  //   if (!user || (!user.isCreator && !user.event.allowOthersToViewResults)) {
  if (!user) {
    return notFound();
  }
  const { event } = user;
  const { users } = event;

  console.log(users.map((user) => user.availableDates));

  const dates = _.chain(users)
    .flatMap((user) => user.availableDates)
    .uniqBy((date) => date.toUTCString())
    .map((date) => {
      const dateUsers = users
        .filter((user) => user.availableDates.some((x) => x.toISOString() === date.toISOString()))
        .map((x) => x.id);

      return {
        date,
        dateUsers,
      };
    })
    .sortBy((date) => date.date)
    .value();

  const { available, unavailable } = _.chain(dates)
    .groupBy(({ dateUsers }) => (dateUsers.length === users.length ? "available" : "unavailable"))
    .mapValues((dates) => dates.map(({ date }) => toZonedTime(date, "Etc/UTC")))
    .value();

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4">
        <CopyLink id={event.id} />
        <AggregatedDates available={available ?? []} unavailable={unavailable ?? []} test={users[0].availableDates} />
        <div className="overflow-x-auto">
          <table className="table table-pin-rows table-pin-cols">
            <thead>
              <tr>
                <th></th>
                {dates.map(({ date }) => (
                  <th className="text-center" key={date.toISOString()}>
                    {format(toZonedTime(date, "Etc/UTC"), "MMM d")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(({ id, name }) => (
                <tr key={id}>
                  <td className="border-2 border-base-100 w-1 whitespace-nowrap">{name}</td>
                  {dates.map(({ date, dateUsers }) => (
                    <td
                      key={date.toISOString()}
                      className={`border-2 border-base-100 ${dateUsers.includes(id) ? "bg-success" : "bg-error"}`}
                    ></td>
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
        <CopyLink id={userId} isResults />
      </div>
    </div>
  );
}
