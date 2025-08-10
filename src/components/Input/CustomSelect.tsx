import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import  { type ReactNode } from "react";

interface OptionType {
  label: string;
  value: string;
}

const CustomSelect = ({
  value,
  label,
  onChange,
  name,
  required = false,
  options = [],
  multiple=false,
}: {
  value?: string | string[];
  label: string;
  onChange: (event: SelectChangeEvent<string | string[]>, child: ReactNode) => void;
  name: string;
  required?: boolean;
  options: OptionType[];
  multiple?:boolean
}) => {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel required={required}>{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          name={name}
          label={label}
          onChange={onChange}
          required={required}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              height: "44px", // height 
            },
            "& .MuiInputLabel-asterisk": {
              color: "#DE1135", // red asterisk
            },
            "& .MuiInputLabel-root": {
              lineHeight: "1",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#a3b18a", // border color on focus
              },
            },
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              height: "44px", // ensure select matches TextField height
              padding: "10px 14px", // adjust padding for alignment
            },
            "& label.Mui-focused": {
              color: "#a3b18a", // label color on focus
            },
          }}
          multiple={multiple}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default CustomSelect;
