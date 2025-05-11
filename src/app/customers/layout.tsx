"use client";
import HeaderCustomer from "@/components/Header/HeaderCustomer";
import SidebarCustomer from "@/components/Sidebar/SidebarCustomer";
import { fetchCustomerProfile } from "@/redux/store/slices/customerSlices/get_profile.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isOpen = useSelector((state: RootState) => state.status_tab_menu);
  const router = useRouter();
  const { datas: dataProfileCustomer } = useSelector(
    (state: RootState) => state.get_profile_customer
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!dataProfileCustomer) {
      dispatch(fetchCustomerProfile())
        .unwrap()
        .then((dt) => {
          if (dt.statusCode === 400) {
            router.push("/login?type=customer");
          }
        })
        .catch(() => {
          router.push("/login?type=customer");
        });
    }
  }, [dispatch, router, dataProfileCustomer]);
  return (
    <>
      {/* max-w-[calc(100%-13rem)] */}
      <div className="flex flex-col h-full">
        <HeaderCustomer />
        {/* {dataProfile && ( */}
        <>
          <div className=" flex flex-1 overflow-y-hidden overflow-x-auto min-h-fit">
            <div
              className={`h-full sm:relative inset-x-0 absolute z-40 transition-all   ${
                isOpen.isOpen ? "sm:min-w-52" : "w-0 "
              }`}
            >
              <SidebarCustomer />
            </div>
            <div
              className={` transition-all flex-1 overflow-y-scroll sm:w-auto w-screen  ${
                isOpen.isOpen ? "" : ""
              }`}
            >
              {children}
            </div>
          </div>
        </>
        {/* )} */}
      </div>
    </>
  );
}
