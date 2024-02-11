import Button from "react-bootstrap/Button";
import { login } from "../Auth/AuthApi";

function Playground() {
  // Event Handling
  const testFunc = async () => {
    const data = { email: "normal@user.com", password: "foo" };

    const response = await login(data);
    console.log(response.json());
  };
  return <Button onClick={testFunc}>Test</Button>;
}

export default Playground;
