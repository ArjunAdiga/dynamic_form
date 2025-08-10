import { TextField } from "@mui/material";
import React, { useState } from "react";

const CustomTextField = ({
  label,
  name,
  onChange,
  value,
  type="text",
  required=false,
  disabled= false,
   minLength,
  maxLength,
  isEmail = false,
  isPassword = false,
}: {
  label: string;
  name: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value?: string | number;
  type?: string;
  required?:boolean
  disabled?:boolean
  minLength?: number;
  maxLength?: number;
  isEmail?: boolean;
  isPassword?: boolean;
}) => {
   const [error, setError] = useState<string>("");

     const validate = (val: string) => {
    // Required / Not Empty
    if (required && !val.trim()) {
      return "This field is required";
    }

    // Min Length
    if (minLength !== undefined && val.length < minLength) {
      return `Minimum length is ${minLength}`;
    }

    // Max Length
    if (maxLength !== undefined && val.length > maxLength) {
      return `Maximum length is ${maxLength}`;
    }

    // Email
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (val && !emailRegex.test(val)) {
        return "Invalid email address";
      }
    }

    // Password
    if (isPassword) {
      const passwordRegex =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
      if (val && !passwordRegex.test(val)) {
        return "Password must be at least 8 chars, include a number & special character";
      }
    }

    return "";
  }; 

   const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = e.target.value;
    const errMsg = validate(val);
    setError(errMsg);
    onChange(e);
  };

  return (
    <TextField
      id="outlined-basic"
      label={label}
      name={name}
      variant="outlined"
      onChange={handleChange}
      value={value}
      required={required}
      type={type}
      disabled={disabled}
      error={Boolean(error)}
      helperText={error}
      inputProps={{
      maxLength: maxLength ? Number(maxLength) : undefined,
    }}
      sx={{
        width:"100%",
        "& .MuiInputBase-root": {
          height: "44px",
        },
        "& .MuiInputLabel-asterisk": {
          color: "#DE1135",
        },
        "& .MuiInputLabel-root": {
          lineHeight: "1",
        },
        // "& .MuiOutlinedInput-root": {
        //   "&.Mui-focused fieldset": {
        //     borderColor: "#a3b18a",
        //   },
        // },
        // "& label.Mui-focused": {
        //   color: "#a3b18a",
        // },
      }}
    />
  );
};

export default CustomTextField;
