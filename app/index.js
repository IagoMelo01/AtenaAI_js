import LoginAtena from "./LoginAtena";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { login } = useAuth();

  return (
    <LoginAtena
      title="Login"
      onLogin={async ({ matricula, password }) => {
        await login({ matricula, password });
      }}
    />
  );
}
