import MyHabits from "@/components/app/MyHabits";
import NewHabitModal from "@/components/modals/NewHabit";
import PaymentModal from "@/components/modals/PaymentModal";

export const metadata = {
  title: "هبیتیفای - عادت های من",
  description: "عادت هایی که قراره باهاشون بترکونم !",
};

const MyHabitsPage = () => {
  return (
    <div className="space-y-10">
      <NewHabitModal />
      <MyHabits />
      <PaymentModal />
    </div>
  );
};

export default MyHabitsPage;
