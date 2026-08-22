import { useContext } from "react";
import SheetsContext from "../context/SheetsContextDefinition";

function useSheets() {
  const context = useContext(SheetsContext);

  if (!context) {
    throw new Error(
      "useSheets must be used inside a SheetsProvider"
    );
  }

  return context;
}

export default useSheets;
