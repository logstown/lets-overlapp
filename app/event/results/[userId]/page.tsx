import prisma from "@/lib/prisma";
import CopyLink from "./_CopyLink";
import { notFound } from "next/navigation";
import _, { map } from "lodash";
import { format } from "date-fns";
import AggregatedDates from "./_AggregatedDates";
import { getJSDateFromStr } from "@/lib/utilities";
import DaysLegend from "@/components/DaysLegend";
import { CircleUserIcon } from "lucide-react";
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
    .map(({ date, availableDateUsers, preferredDateUsers }) => {
      return {
        date: getJSDateFromStr(date),
        availableDateUsers,
        preferredDateUsers,
      };
    })
    .sortBy((date) => date.date)
    .value();

  const { available, unavailable, preferred } = _.chain(dates)
    .groupBy(({ availableDateUsers, preferredDateUsers }) => {
      if (preferredDateUsers.length === users.length) {
        return "preferred";
      }

      if (preferredDateUsers.length + availableDateUsers.length === users.length) {
        return "available";
      }

      return "unavailable";
    })
    .mapValues((dates) => map(dates, "date"))
    .value();

  return (
    <div className="flex flex-col gap-10">
      <CopyLink id={event.id} />
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12">
        <AggregatedDates available={available ?? []} unavailable={unavailable ?? []} preferred={preferred ?? []} />
        <DaysLegend includeUnavailable />
      </div>
      <div className="overflow-x-auto">
        <table className="table table-pin-rows table-xs sm:table-sm md:table-md table-pin-cols text-sm sm:text-base">
          <thead>
            <tr>
              <th></th>
              {dates.map(({ date }) => (
                <td className="text-center" key={date.toISOString()}>
                  {format(date, "MMM d")}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(({ id, name, isCreator }) => (
              <tr key={id}>
                <th className="border-2 border-base-100 w-1">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    {name}
                    {isCreator && <CircleUserIcon size={15} />}
                  </div>
                </th>
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
  );
}
