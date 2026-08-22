import { useContext } from "react";

import BusinessContext from "../context/BusinessContextDefinition";

function useBusiness() {
  const context = useContext(BusinessContext);

  if (!context) {
    throw new Error(
      "useBusiness must be used inside a BusinessProvider"
    );
  }

  return context;
}

export default useBusiness;