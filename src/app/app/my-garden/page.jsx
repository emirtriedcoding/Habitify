import MyGarden from "@/components/app/MyGarden";

import { authUser } from "@/lib/helpers";

export const metadata = {
  title: "هبیتیفای - مزرعه من",
};

const MyGardenPage = async () => {
  const user = await authUser();
  return (
    <div>
      <MyGarden userId={JSON.parse(JSON.stringify(user))._id} />
    </div>
  );
};

export default MyGardenPage;
