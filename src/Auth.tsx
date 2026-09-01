import { useDialogs } from "@toolpad/core";
import { compareSync } from "bcryptjs";
import { lazy, useEffect, useState } from "react";
import PasswordDialog from "./components/PasswordDialog.tsx";

const App = lazy(() => import("./App.tsx"));

const PASSWORD_HASH =
  "$2a$12$tAdX1YDpXRRuxUDANoDN1OHT1xX5TLylvL/UZPKkffeoFiIfDFb6.";

export function Auth() {
  const dialogs = useDialogs();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) return;

    const checkAuth = async () => {
      const plainPassword = await dialogs.open(PasswordDialog);
      const authenticated = compareSync(plainPassword ?? "", PASSWORD_HASH);
      if (!authenticated) await checkAuth();
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [dialogs, isAuthenticated]);

  if (!isAuthenticated) return null;

  return <App />;
}
