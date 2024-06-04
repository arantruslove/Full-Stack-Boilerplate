import { ListGroup } from "react-bootstrap";

/**Page component that displays account details.*/
function Account({ email }) {
  return (
    <ListGroup>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">Email</div>
          {email}
        </div>
      </ListGroup.Item>
    </ListGroup>
  );
}

export default Account;
