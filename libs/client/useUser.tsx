import { User } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import useSWR from "swr";

interface IUser {
  ok: boolean;
  profile: User;
}

//const fetcher = (url: string) => fetch(url).then((response) => response.json());
//유저 데이터에 접근할 수 잇는 훅을 만들고 각 페이지에서 데이터를 불러오면 편하다.
export default function useUser() {
  const { data, error } = useSWR<IUser>("/api/users/me");
  const router = useRouter();
  const pathname = usePathname();
  //데이터가 변경될 때만 호출되도록 `useEffect`를 사용
  useEffect(() => {
    if (data && !data.ok) {
      return router.replace("/enter");
    }
    if (data && data.ok && pathname === "/enter") {
      router.replace("/profile");
    }
  }, [data, router, pathname]);
  /* useEffect(() => {
    fetch("/api/users/me")
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) {
          return router.replace("/enter");
        }
        setUser(data.profile);
      });
  }, [router]); */
  return { user: data?.profile, isLoading: !data && !error };
}
