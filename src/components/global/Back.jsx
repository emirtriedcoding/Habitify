"use client";

import { useRouter } from "next/navigation";

const Back = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back("/app/my-habits");
    router.refresh()
  };

  return <div onClick={handleBack} className="btn mb-2" >بازگشت</div>;
};

export default Back;
