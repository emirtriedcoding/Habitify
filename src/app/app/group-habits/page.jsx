import NewGroupHabitModal from "@/components/modals/NewGroupHabit";
import JoinGroup from "@/components/modals/JoinGroup";
import GroupHabits from "@/components/app/GroupHabits";

export const metadata = {
  title: "هبیتیفای - عادت های گروهی",
};

const GroupHabitsPage = () => {
  return (
    <div className="min-h-screen space-y-10">
      <div className="flex items-center justify-between">
        <NewGroupHabitModal />
        <JoinGroup />
      </div>
      <GroupHabits />
    </div>
  );
};

export default GroupHabitsPage;
