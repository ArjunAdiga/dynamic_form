import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface OptionType {
  label: string;
  value: string;
}

const CustomRadio = ({
  value = "",
  label,
  onChange,
  name,
  required = false,
  options = [],
}: {
  value?: string;
  label: string;
  onChange: (optionValue: string) => void;
  name: string;
  required?: boolean;
  options: OptionType[];
}) => {
  return (
    <FormControl required={required}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {options.map((opt) => (
            <FormControlLabel
              key={opt.value}
              value={opt.value}
              control={<Radio />}
              label={opt.label}
            />
          ))}
        </div>
      </RadioGroup>
    </FormControl>
  );
};

export default CustomRadio;
