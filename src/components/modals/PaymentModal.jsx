"use client";

import axios from "axios";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { toast } from "sonner";

const PaymentModal = () => {
  const searchParams = useSearchParams();

  const [refId, setRefId] = useState("");

  const status = searchParams.get("Status");
  const authority = searchParams.get("Authority");

  useEffect(() => {
    const verifyPayment = async () => {
      if (status === "OK" && authority) {
        try {
          const res = await axios.put("/api/verify-payment", { authority });

          if (res.data.ref_id) {
            setRefId(res.data.ref_id);
            const paymentModal = document.getElementById("payment_modal");
            if (paymentModal) {
              paymentModal.showModal();
            } else {
              console.error("Payment modal not found!");
            }
          }
        } catch (error) {
          toast.error("خطای سرور !");
          console.error("Error verifying payment:", error);
        }
      }
    };

    verifyPayment();
  }, [searchParams, status, authority]);

  return (
    <dialog id="payment_modal" className="modal">
      <div className="modal-box space-y-6">
        <h3 className="text-lg font-bold">تبریک میگم !</h3>
        <p className="text-sm text-gray-500">پرداخت با موفقیت انجام شد !</p>
        <div className="flex items-center justify-between text-sm font-bold">
          <span>شماره تراکنش :</span>
          <p className="text-success">{refId}</p>
        </div>
        <button
          onClick={() => document.getElementById("payment_modal").close()}
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

export default PaymentModal;
