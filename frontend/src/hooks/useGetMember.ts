import { useCallback, useEffect, useState } from "react";
import { buildApiUrl } from "../../config/api";

export interface GetMemberProps {
  userId: Number;
}

export interface Member {
  taxNumber: number;
  photo: string;
}

export interface GetMember {
  member: Member;
  isError: boolean;
  isLoading: boolean;
  load: () => void;
}

export const useGetMember = (userId : GetMemberProps) : GetMember => {
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [member, setMember] = useState({
    taxNumber: 0,
    photo: ''
  });

  const fetchingData = useCallback(() => {
    const querie = buildApiUrl(`/users/member/${userId}`);

    if (userId) {
      setLoading(true);

      fetch(querie, {
        headers: { Accept: "application/json" },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((response) => setMember(response))
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  return {
    member,
    isError,
    isLoading,
    load: fetchingData,
  };
};
