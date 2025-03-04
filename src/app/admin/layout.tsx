"use client";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { fetchTypeActivities } from "@/redux/store/slices/activitySlices/type_activity.slice";
import { fetchTypeWork } from "@/redux/store/slices/activitySlices/type_work.slice";
import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";
import { fetchGroupCustomer } from "@/redux/store/slices/customerSlices/get_all_group.slice";
import { fetchProjects } from "@/redux/store/slices/projectSlices/get_all_project.slice";
import { fetchGroupUser } from "@/redux/store/slices/userSlices/get_all_group.slice";
import { fetchUserProfile } from "@/redux/store/slices/userSlices/get_profile.slice";
import { fetchRoleAccess } from "@/redux/store/slices/userSlices/get_role.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isAuthorized = useCheckRole(["admin-top"]);
  const isOpen = useSelector((state: RootState) => state.status_tab_menu);
  const router = useRouter();
  const { datas: dataProfile, loading } = useSelector(
    (state: RootState) => state.get_profile
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchRoleAccess());
    if (!dataProfile && !loading) {
      dispatch(fetchTypeActivities());
      dispatch(fetchGroupCustomer());
      dispatch(fetchGroupUser());
      dispatch(fetchTypeWork());
      dispatch(fetchGroupUser());
      if (isAuthorized) {
        dispatch(fetchProjects());
        dispatch(fetchContracts({}));
      }
    }
  }, [dataProfile, loading, dispatch, router, isAuthorized]);

  useEffect(() => {
    dispatch(fetchUserProfile())
      .unwrap()
      .then((dt) => {
        if (dt.statusCode === 400) {
          router.push("/login");
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [dispatch, router]);
  return (
    <>
      {/* max-w-[calc(100%-13rem)] */}
      <div className="flex flex-col h-full">
        <Header />
        {dataProfile && (
          <>
            <div className=" flex flex-1 overflow-y-hidden overflow-x-auto min-h-fit">
              <div
                className={`h-full sm:relative inset-x-0 absolute z-40 transition-all   ${
                  isOpen.isOpen ? "sm:min-w-52" : "w-0 "
                }`}
              >
                <Sidebar />
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
        )}
      </div>
    </>
  );
}
