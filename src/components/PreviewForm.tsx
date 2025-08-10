

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import type { FormSchema, FieldSchema } from "./FieldType";
import CustomTextField from "./Input/CustomTextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomSelect from "./Input/CustomSelect";
import CustomRadio from "./Input/CustomRadio";
import CustomCheckbox from "./Input/CustomCheckbox";
import { Button } from "@mui/material";
import dayjs from "dayjs";



const PreviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const forms: FormSchema[] = JSON.parse(localStorage.getItem("forms") || "[]");

  const form = useMemo(() => forms.find((f) => f.id === id), [forms, id]);

  const buildInitialValues = (frm?: FormSchema) => {
    if (!frm) return {};
    return frm.fields.reduce((acc: Record<string, any>, f: FieldSchema) => {
      if (f.type === "date") acc[f.id] = null; 
      else if (f.type === "checkbox") acc[f.id] = f.defaultValue ?? []; 
      else acc[f.id] = f.defaultValue ?? "";
      return acc;
    }, {});
  };

  const [formValues, setFormValues] = useState<Record<string, any>>(
    () => buildInitialValues(form)
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

 
  useEffect(() => {
    setFormValues(buildInitialValues(form));
    setErrors({});
  }, [id, form?.createdAt]); 


  const handleChange = useCallback((fieldId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

 
  const derivedParentIds = useMemo(() => {
    if (!form) return [] as string[];
    const s = new Set<string>();
    form.fields.forEach((f) => {
      if (f.parents && Array.isArray(f.parents)) {
        f.parents.forEach((p) => s.add(p));
      }
    });
    return Array.from(s);
  }, [form]);

 useEffect(() => {
  if (!form || derivedParentIds.length === 0) return;

  const nextValues = { ...formValues };
  let changed = false;

  form.fields.forEach((f) => {
    if (!f.parents || !f.formula) return;

    try {
      const parentVals: Record<string, any> = {};
      f.parents.forEach((pid) => {
        parentVals[pid] = nextValues[pid];
      });

      const wrapped = new Function(
        "dayjs",
        ...f.parents,
        `const today = dayjs();
         const year = (d) => d && dayjs(d).isValid() ? dayjs(d).year() : 0;
         return (${f.formula});`
      );

      const result = wrapped(dayjs, ...f.parents.map((pid) => parentVals[pid]));

      if (nextValues[f.id] !== result) {
        nextValues[f.id] = result;
        changed = true;
      }
    } catch (err) {
      console.warn("Derived formula error", f.label, err);
    }
  });

  if (changed) {
    setFormValues(nextValues);
  }
}, [form, ...derivedParentIds.map((pid) => formValues[pid])]);


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form) {
      setErrors(newErrors);
      return true;
    }

    form.fields.forEach((field) => {
      const value = formValues[field.id];

      // required
      if (field.required) {
        const empty =
          value === null ||
          value === undefined ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0);
        if (empty) {
          newErrors[field.id] = "This field is required";
          return;
        }
      }

      // notempty (explicit)
      if (field.notempty) {
        if (typeof value === "string" && value.trim() === "") {
          newErrors[field.id] = "This field cannot be empty";
          return;
        }
      }

      if (field.min !== undefined && field.min !== null && field.min !== "") {
        const minN = Number(field.min);
        if (!Number.isNaN(minN) && typeof value === "string" && value.length < minN) {
          newErrors[field.id] = `Minimum length is ${minN}`;
          return;
        }
      }
      if (field.max !== undefined && field.max !== null && field.max !== "") {
        const maxN = Number(field.max);
        if (!Number.isNaN(maxN) && typeof value === "string" && value.length > maxN) {
          newErrors[field.id] = `Maximum length is ${maxN}`;
          return;
        }
      }

      // email
      if (field.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
          newErrors[field.id] = "Invalid email address";
          return;
        }
      }

      if (field.password && value) {
        const passRegex = /^(?=.*\d).{8,}$/;
        if (!passRegex.test(String(value))) {
          newErrors[field.id] = "Password must be at least 8 chars and include a number";
          return;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const outputValues: Record<string, any> = {};
    Object.keys(formValues).forEach((k) => {
      const v = formValues[k];
      if (dayjs.isDayjs(v)) outputValues[k] = v.format("YYYY-MM-DD");
      else outputValues[k] = v;
    });


    navigate("/myforms");
  };

  if (!form) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ fontSize: 20 }}>Form not found</p>
      </div>
    );
  }

  return (
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
        marginTop: "12px",
      }}
    >
      <p
        style={{
          fontWeight: 500,
          color: "black",
          fontSize: "24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {form.formName}
      </p>

      {form.fields.map((field) => (
        <div key={field.id} style={{ width: "100%" }}>
          {field.type === "text" || field.type === "number" ? (
            <CustomTextField
              label={field.label}
              type={field.type === "number" ? "number" : "text"}
              required={field.required}
              value={formValues[field.id]}
              name={field.label}
              onChange={(e) => handleChange(field.id, e.target.value)}
                
            />
          ) : field.type === "textarea" ? (
            <textarea
              style={{
                fontSize: "14px",
                overflow: "auto",
                overflowY: "auto",
                maxHeight: "75px",
                scrollbarWidth: "none",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                width: "90%",
                padding: "4px 2px 4px 8px",
                resize: "none",
                backgroundColor: "#fffafa",
              }}
              value={formValues[field.id] ?? ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          ) : field.type === "date" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                value={formValues[field.id] ?? null}
                onChange={(newValue) => handleChange(field.id, newValue)}
              />
            </LocalizationProvider>
          ) : field.type === "radio" ? (
            <CustomRadio
              label={field.label}
              required={field.required}
              options={field.options || []}
              value={formValues[field.id] ?? ""}
              onChange={(val) => handleChange(field.id, val)}
              name={field.label}
            />
          ) : field.type === "checkbox" ? (
            <CustomCheckbox
              label={field.label}
              required={field.required}
              options={field.options || []}
              value={formValues[field.id] ?? []}
              onChange={(optionValue: string, checked: boolean) => {
                const curr = formValues[field.id] ?? [];
                const updated = checked
                  ? [...curr, optionValue]
                  : curr.filter((v: string) => v !== optionValue);
                handleChange(field.id, updated);
              }}
              name={field.label}
            />
          ) : (
            <CustomSelect
              label={field.label}
              required={field.required}
              options={field.options || []}
              value={formValues[field.id] ?? ( field?.type === "select" ? [] : "")}
              onChange={(e) => handleChange(field.id, e.target.value)}
              name={field.label}
            />
          )}

          {errors[field.id] && (
            <p style={{ color: "red", fontSize: "12px" }}>{errors[field.id]}</p>
          )}
        </div>
      ))}

      <Button
        variant="contained"
        size="medium"
        sx={{ backgroundColor: "#a3b18a" }}
        onClick={handleSave}
      >
        Save
      </Button>
    </div>
  );
};

export default PreviewForm;

