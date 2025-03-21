import prisma from "@/lib/prisma";
import CopyLink from "./_CopyLink";
import { notFound } from "next/navigation";
import _, { groupBy, map } from "lodash";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { CheckIcon } from "lucide-react";
import AggregatedDates from "./_AggregatedDates";
import { getJSDateFromStr } from "@/lib/utilities";
import DaysLegend from "@/components/DaysLegend";
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
    .flatMap((user) => [...user.availableDates, ...user.preferredDates])
    .uniq()
    .map((date) => {
      const availableDateUsers = users.filter((user) => user.availableDates.includes(date)).map((x) => x.id);
      const preferredDateUsers = users.filter((user) => user.preferredDates.includes(date)).map((x) => x.id);
      return {
        date,
        availableDateUsers,
        preferredDateUsers,
      };
    })
    .sortBy((date) => date.date)
    .map(({ date, availableDateUsers, preferredDateUsers }) => {
      return {
        date: getJSDateFromStr(date),
        availableDateUsers,
        preferredDateUsers,
      };
    })
    .value();

  const { available, unavailable, preferred } = _.chain(dates)
    .groupBy(({ availableDateUsers, preferredDateUsers }) => {
      if (preferredDateUsers.length === users.length) {
        return "preferred";
      } else if (preferredDateUsers.length + availableDateUsers.length === users.length) {
        return "available";
      }

      return "unavailable";
    })
    .mapValues((dates) => map(dates, "date"))
    .value();

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex flex-col gap-10">
        <CopyLink id={event.id} />
        <div className="flex flex-row justify-center gap-12">
          <AggregatedDates available={available ?? []} unavailable={unavailable ?? []} preferred={preferred ?? []} />
          <DaysLegend includeUnavailable />
        </div>
        <div className="overflow-x-auto">
          <table className="table table-pin-rows table-pin-cols">
            <thead>
              <tr>
                <th></th>
                {dates.map(({ date }) => (
                  <th className="text-center" key={date.toISOString()}>
                    {format(date, "MMM d")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(({ id, name }) => (
                <tr key={id}>
                  <td className="border-2 border-base-100 w-1 whitespace-nowrap">{name}</td>
                  {dates.map(({ date, availableDateUsers, preferredDateUsers }) => (
                    <td
                      key={date.toISOString()}
                      className={`border-2 border-base-100 ${
                        preferredDateUsers.includes(id)
                          ? "bg-success"
                          : availableDateUsers.includes(id)
                          ? "bg-success/50"
                          : "bg-error"
                      }`}
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
