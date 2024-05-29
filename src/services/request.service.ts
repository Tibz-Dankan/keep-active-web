import { backendURL } from "@/constants";
import { TGetRequestsByApp } from "@/types/app";

export class RequestService {
  getByApp = async ({ appId, accessToken }: TGetRequestsByApp) => {
    const response = await fetch(
      `${backendURL}/requests/get-by-app?appId=${appId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  };
}