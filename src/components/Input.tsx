import { IonInput } from "@ionic/react";

const Input = ({ ...rest }) => {
  return (
    <IonInput
      fill="outline"
      style={{ minHeight: "40px", marginTop: "20px" }}
      color={"dark"}
      {...rest}
    />
  );
};

export default Input;
