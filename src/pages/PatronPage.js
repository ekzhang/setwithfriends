import Button from "@material-ui/core/Button";
import WhatshotIcon from "@material-ui/icons/Whatshot";

import { patronCheckout } from "../stripe";

function PatronPage() {
  const handleDonate = async () => {
    const result = await patronCheckout();
    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleDonate}
      fullWidth
    >
      <WhatshotIcon style={{ marginRight: "0.2em" }} /> Become a patron
    </Button>
  );
}

export default PatronPage;
