"use client";

import Search from "./Search";
import Profile from "./Profile";
import Activities from "./Activities";

const Social = ({ user, topUsers }) => {
  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <div className="card border border-base-200 shadow-sm lg:w-1/2">
        <div className="card-body !p-2 gap-7">
          <h5 className="card-title">پروفایل من</h5>
          <Profile user={user} currentUser={user} />
        </div>
      </div>
      <div className="!space-y-5 lg:w-1/2">
        <Search />
        <div className="card border border-base-200 shadow-sm">
          <div className="card-body max-h-[500px] gap-5">
            <h5 className="card-title">افراد برتر</h5>
            {topUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={user.image || "/assets/noavatar.png"}
                    alt="User"
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="space-y-2 text-xs font-semibold">
                    <div>{user.name}</div>
                    <span>
                      {user.username
                        ? "@" + user.username
                        : "نام کاربری نداره !"}
                    </span>
                  </div>
                </div>
                <div className="text-[9px] font-bold lg:text-base">
                  {user.score} XP
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card border border-base-200 shadow-sm">
          <div className="card-body max-h-[500px] overflow-y-auto gap-5">
            <h5 className="card-title">فعالیت های اخیر</h5>
            <Activities followings={user.followings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
