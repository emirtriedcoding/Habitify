import DailyTasks from "@/components/app/DailyTasks";
import Achievements from "@/components/app/Achievements";

export const metadata = {
  title: "هبیتیفای - ماموریت ها",
};

const MissionsPage = () => {
  return (
    <div className="space-y-10">
      <DailyTasks />
      <Achievements />
    </div>
  );
};

export default MissionsPage;
