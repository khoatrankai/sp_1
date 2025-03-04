"use client";
import { RootState } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Custom hook
export default function useCheckRole(roles: string[]): boolean {
  const [roleOK, setRoleOK] = useState<boolean>(false);
  const { datas: dataRoleAccess } = useSelector(
    (state: RootState) => state.get_access_roles
  );

  useEffect(() => {
    if (dataRoleAccess && dataRoleAccess?.length > 0) {
      const hasCommonElement = dataRoleAccess.some((item) =>
        roles.includes(item.role_type.name_tag)
      );
      setRoleOK(hasCommonElement);
    }
  }, [dataRoleAccess, roles]);

  return roleOK;
}
