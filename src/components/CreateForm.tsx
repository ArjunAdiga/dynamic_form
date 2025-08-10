import { NotebookPen, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormSchema, FieldSchema } from "./FieldType";
import { v4 as uuidv4 } from "uuid";
import { FieldItem } from "./FieldItem";
import { Button } from "@mui/material";

const CreateForm = () => {
  const [formState, setFormState] = useState<FormSchema>();
  const navigate = useNavigate();

const updateField = <K extends keyof FieldSchema>(
  fieldId: string,
  key: K,
  value: FieldSchema[K]
) => {
  setFormState((prev) => {
    if (!prev) return prev;

    const updatedFields = prev.fields.map((field) => {
      if (field.id !== fieldId) return field;

      
      if (Array.isArray(value)) {
        return { ...field, [key]: [...value] } as FieldSchema;
      }

      return { ...field, [key]: value };
    });

    return { ...prev, fields: updatedFields };
  });
};


  const handleCreateForm = () => {
  if (!formState) {
    // Creating a form for the first time
    const newForm: FormSchema = {
      id: uuidv4(),
      formName: "",
      createdAt: new Date().toISOString(),
      fields: [
        {
          id: uuidv4(),
          label: "",
          type: "text",
          required: false,
          defaultValue: "",
          notempty: false,
          min: null,
          max: null,
          email: false,
          password: false,
          parents: [],
          formula: null,
          options: [],
        },
      ],
    };
    setFormState(newForm);
  } else {
    // Add new field to existing form
    const newField: FieldSchema = {
      id: uuidv4(),
      label: "",
      type: "text",
      required: false,
      defaultValue: "",
      notempty: false,
      min: null,
      max: null,
      email: false,
      password: false,
      parents: [],
      formula: null,
      options: [],
    };

    setFormState({
      ...formState,
      fields: [...formState.fields, newField],
    });
  }
};

const handleSaveForm = () => {
  if (!formState) return;


  const name = prompt("Enter a name for this form:", formState.formName || "");
  if (!name) return; 

  
  const finalForm = { ...formState, formName: name };


  const existingForms: FormSchema[] = JSON.parse(localStorage.getItem("forms") || "[]");


  const updatedForms = [
    ...existingForms.filter(f => f.id !== formState.id), 
    finalForm
  ];

  localStorage.setItem("forms", JSON.stringify(updatedForms));

  setFormState(finalForm);
    navigate("/myforms");

};

const deleteField = (fieldId: string) => {
  setFormState((prev) => {
    if (!prev) return prev; // nothing to delete

    return {
      ...prev,
      fields: prev.fields.filter((f) => f.id !== fieldId),
    } as FormSchema; // ensure it matches FormSchema
  });
};


  return (
    <>
      <div>
        <p
          style={{
            fontWeight: 500,
            color: "black",
            fontSize: "32px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Create form
        </p>
        <div>
          {!formState?.id ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              {" "}
              <NotebookPen size={32} />{" "}
              <p
                style={{
                  fontWeight: 400,
                  color: "black",
                  fontSize: "18px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Form is empty
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={handleCreateForm}
              >
                <Plus size={18} color="#703dde" />
                <p
                  style={{
                    fontWeight: 400,
                    color: "#703dde",
                    fontSize: "16px",
                  }}
                >
                  Add
                </p>{" "}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
                width: "100%",
              }}
            >
              {" "}
              {formState?.fields?.map((item: FieldSchema, index: number) => (
                <FieldItem item={item} index={index} formState={formState} updateField={updateField} deleteField={deleteField} />
              ))}{" "}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={handleCreateForm}
              >
                <Plus size={18} color="#703dde" />
                <p
                  style={{
                    fontWeight: 400,
                    color: "#703dde",
                    fontSize: "16px",
                  }}
                >
                  Add
                </p>{" "}
              </div>
              <div>
                <Button
                  variant="contained"
                  onClick={handleSaveForm}
                  size="medium"
                  sx={{ backgroundColor: "#a3b18a" }}
                  disabled={!formState?.id}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateForm;
