import Button from "react-bootstrap/Button";
import { testFetch } from "./playgroundApi";

function Playground() {
  // Event Handling
  const testFunc = async () => {
    const response = await testFetch();

    console.log(response);
  };
  return <Button onClick={testFunc}>Test</Button>;
}

export default Playground;
