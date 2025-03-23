import ChooseUserDates from "../../../components/ChooseUserDates";

export default function CreateEvent() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl uppercase font-light text-base-content/50">Create Event</h1>
      <ChooseUserDates />
    </div>
  );
}
