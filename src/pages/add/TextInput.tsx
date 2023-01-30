import React from "react";
import { Input } from "@geist-ui/core";

type InputTypes = "default" | "secondary" | "success" | "warning" | "error";
type Props = {
  title: string;
  placeholder: string;
  type:string ;
  onChange: any;
  value: string | undefined;
  uiType:InputTypes;
};

const TextInput = (props: Props) => {
  const { title, value, placeholder, type } = props;

  return (
    <Input
      clearable
      label={props.title}
      placeholder={props.placeholder}
      htmlType={props.type}
      type={props.uiType}
      width="100%"
      onChange={props.onChange}
      value={props.value}
    />
  );
};

export default TextInput;
