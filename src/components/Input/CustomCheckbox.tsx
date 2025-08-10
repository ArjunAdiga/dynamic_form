import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

interface OptionType {
  label: string;
  value: string;
}
const CustomCheckbox = ({
  value = [],
  label,
  onChange,
  options = [],
}: {
  value?: string[];
  label: string;
  onChange: (optionValue: string, checked: boolean) => void;
  name: string;
  required?: boolean;
  options: OptionType[];
}) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <FormGroup>
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
              control={
                <Checkbox
                  checked={(value || []).includes(opt.value)} 
                onChange={(e) => onChange(opt.value, e.target.checked)}
                />
              }
              label={opt.label}
            />
          ))}
        </div>
      </FormGroup>
    </FormControl>
  );
};

export default CustomCheckbox;
