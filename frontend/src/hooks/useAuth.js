import { useContext } from "react";
import AuthContext from "../context/AuthContextDefinition";

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}

export default useAuth;