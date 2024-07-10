import { useLocation } from "react-router";

export const useCurrentQueryParams = paramID => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    return queryParams.get(paramID);
}