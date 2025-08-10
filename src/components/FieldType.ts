interface OptionType {
    label:string,
    value:string,
}
export interface FieldSchema {
    id:string,
  label: string;
  type: "text" | "textarea" | "number" | "select" | "checkbox" | "radio" | "date";
  required: boolean;
  defaultValue?: string | number | null;
    notempty:boolean,
    min?:string | null,
    max?:string | null,
    email?:boolean,
    password?:boolean,
    parents?: string[] | null;
    formula?: string | null;
  options?:OptionType[]
} 
export  interface FormSchema {
    id:string,
    formName:string,
    createdAt: string,
    fields: FieldSchema[];
}