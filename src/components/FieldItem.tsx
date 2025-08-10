import { FormControlLabel, Switch } from "@mui/material";
import type { FieldSchema, FormSchema } from "./FieldType";
import CustomTextField from "./Input/CustomTextField";
import CustomSelect from "./Input/CustomSelect";
import { Plus, Trash } from "lucide-react";

export const FieldItem = ({
  item,
  index,
  formState,
  updateField,
  deleteField
}: {
  item: FieldSchema;
  index: number;
  formState: FormSchema;
  updateField: <K extends keyof FieldSchema>(
    fieldId: string,
    key: K,
    value: FieldSchema[K]
  ) => void;
    deleteField: (fieldId: string) => void;
}) => {
  const fieldType = [
    { label: "Text", value: "text" },
    { label: "Text Area", value: "textarea" },
    { label: "Number", value: "number" },
    { label: "Select", value: "select" },
    { label: "Radio", value: "radio" },
    { label: "Checkbox", value: "checkbox" },
    { label: "Date", value: "date" },
  ];

  const derivedFields =
    formState?.fields
      ?.filter((it: FieldSchema) => it.id !== item.id)
      ?.map((it: FieldSchema) => ({ label: it?.label, value: it?.id })) || [];

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", gap: "12px",width:"100%" }}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"12px"}}>

        <p style={{ fontSize: "18px", color: "black" }}>{index + 1}</p>
        
          <Trash size={18}   style={{ cursor: "pointer", color: "red" }}
            onClick={() => deleteField(item.id)} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid grey",
            borderRadius: "4px",
            padding: "16px 8px 8px 8px",
            flexDirection: "column",
            width: "100%",
            gap: "12px",
          }}
          key={index}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              gap: "12px",
              width: "100%",
            }}
          >
            <CustomTextField
              label="Enter label"
              name="label"
              value={item.label}
              required
              onChange={(e) => updateField(item.id, "label", e.target.value)}
            />
            <CustomSelect
              label="Select input type"
              name="type"
              value={item.type}
              onChange={(e) =>
                updateField(
                  item.id,
                  "type",
                  e.target.value as FieldSchema["type"]
                )
              }
              options={fieldType}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={item.required}
                  onChange={(_, checked) =>
                    updateField(item.id, "required", checked)
                  }
                />
              }
              label="Required"
            />
          </div>

          {item?.type === "number" ||
          item?.type === "text" ||
          item?.type === "textarea" ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  gap: "12px",
                  width: "100%",
                }}
              >
                <CustomTextField
                  label="Default value"
                  name="defaultValue"
                  value={item.defaultValue ?? ""}
                  onChange={(e) =>
                    updateField(
                      item.id,
                      "defaultValue",
                      e.target.value as FieldSchema["defaultValue"]
                    )
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={item.notempty}
                      onChange={(_, checked) =>
                        updateField(item.id, "notempty", checked)
                      }
                    />
                  }
                  label="Not Empty"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={item.email || false}
                      onChange={(_, checked) =>
                        updateField(item.id, "email", checked)
                      }
                    />
                  }
                  label="Email"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={item.password || false}
                      onChange={(_, checked) =>
                        updateField(item.id, "password", checked)
                      }
                    />
                  }
                  label="Password"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  gap: "12px",
                  width: "100%",
                }}
              >
                <CustomTextField
                  label="Enter minimum length"
                  name="min"
                  type="number"
                  value={item.min ?? ""}
                  onChange={(e) =>
                    updateField(
                      item.id,
                      "min",
                      e.target.value ? e.target.value : null
                    )
                  }
                />
                <CustomTextField
                  label="Enter maximum length"
                  name="max"
                  type="number"
                  value={item.max ?? ""}
                  onChange={(e) =>
                    updateField(
                      item.id,
                      "max",
                      e.target.value ? e.target.value : null
                    )
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  gap: "12px",
                  width: "100%",
                }}
              >
                <CustomSelect
                  label="Select derived parent"
                  name="derivedValue"
                  value={item.parents || []}
                  onChange={(e) => {
                    const values = Array.isArray(e.target.value)
                      ? e.target.value
                      : [e.target.value];
                    updateField(item.id, "parents", values);
                  }}
                  multiple={true}
                  options={derivedFields || []}
                />
                <CustomTextField
                  label="Enter custom formula for derived"
                  name="formula"
                  value={item.formula ?? ""}
                  onChange={(e) =>
                    updateField(item.id, "formula", e.target.value)
                  }
                  disabled={!item.parents || item.parents.length === 0}
                />
              </div>
            </>
          ) : (
            item?.type !== "date" && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  {item.options?.map((opt, optIndex) => (
                    <div key={optIndex} style={{ display: "flex", gap: "8px" }}>
                      <CustomTextField
                        label="Option Value"
                        name={`option-value-${optIndex}`}
                        value={opt.value}
                        onChange={(e) => {
                          const updatedOptions = [...(item.options || [])];
                          updatedOptions[optIndex] = {
                            ...updatedOptions[optIndex],
                            value: e.target.value,
                          };
                          updateField(item.id, "options", updatedOptions);
                        }}
                      />
                      <CustomTextField
                        label="Option Label"
                        name={`option-label-${optIndex}`}
                        value={opt.label}
                        onChange={(e) => {
                          const updatedOptions = [...(item.options || [])];
                          updatedOptions[optIndex] = {
                            ...updatedOptions[optIndex],
                            label: e.target.value,
                          };
                          updateField(item.id, "options", updatedOptions);
                        }}
                      />
                    </div>
                  ))}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "8px",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const newOption = { value: "", label: "" };
                      updateField(item.id, "options", [
                        ...(item.options || []),
                        newOption,
                      ]);
                    }}
                  >
                    <Plus size={18} color="#703dde" />
                    <p
                      style={{
                        fontWeight: 400,
                        color: "#703dde",
                        fontSize: "16px",
                      }}
                    >
                      Add option to choose
                    </p>{" "}
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </>
  );
};
