"use client";

const TaskReward = ({ rewards}) => {
  return (
    <dialog id="daily_reward" className="modal">
      <div className="modal-box space-y-6">
        <h3 className="text-lg font-bold">تبریک میگم !</h3>
        <p className="text-sm text-gray-500">موارد زیر رو دریافت کردی : </p>
        <div className="flex items-center justify-center gap-5">
          {rewards.map((reward, i) => (
            <div key={i} className="flex w-1/3 flex-col items-center gap-3 rounded-lg border-2 border-base-300 p-5 lg:text-lg">
              <span className="text-3xl lg:text-5xl">{reward.icon}</span>
              <p className="font-bold">x{reward.count}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => document.getElementById("task_reward").close()}
          className="btn btn-primary w-full"
        >
          حله
        </button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>بستن</button>
      </form>
    </dialog>
  );
};

export default TaskReward;
