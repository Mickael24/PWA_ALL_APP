import { useState } from "react";

export const useUpdateData = (url = "") => {
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const updateData = (data) => {
    setLoading(true);
    fetch(`/${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
            setData(response.json());
        } else {
          alert("Error ao fazer update");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error);
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    data,
    isError,
    isLoading,
    updateData: updateData,
  };
};
