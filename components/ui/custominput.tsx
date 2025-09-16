import React from "react";
import { Input } from "@/components/ui/input";


const CustomInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
<Input {...props} />
);


export default CustomInput;