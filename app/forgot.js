import ForgotPassword from "./ForgotPassword";
import { forgotPassword } from "../lib/api";

export default function Forgot() {
  return (
    <ForgotPassword
      onSendReset={async (email) => {
        return await forgotPassword({ email });
      }}
    />
  );
}
