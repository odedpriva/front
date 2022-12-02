import React, { useEffect, useState } from "react";
import Api from "../../helpers/api";
import './AuthPresentation.sass';

const api = Api.getInstance();

export interface IStatusAuth {
  email: string;
  model: unknown;
}

export const AuthPresentation: React.FC = () => {

  const [statusAuth, setStatusAuth] = useState<IStatusAuth>(null);

  useEffect(() => {
    (async () => {
      try {
        const auth = await api.getAuthStatus();
        setStatusAuth(auth);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return <>
    {(statusAuth?.email as unknown as boolean) && <div className="authPresentationContainer">
      <div>
        <div className="authEmail">{statusAuth.email}</div>
        <div className="authModel">{statusAuth.model}</div>
      </div>
    </div>}
  </>;
}
