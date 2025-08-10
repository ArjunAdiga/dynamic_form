import { Link } from "react-router-dom";
import type { FormSchema } from "./FieldType";
import "./FormStyles.css";

const ViewAllForm = () => {
  const forms: FormSchema[] = JSON.parse(localStorage.getItem("forms") || "[]");
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2>All Forms</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10%",
            borderBottom: "1px solid black",
            paddingBottom: "8px",
          }}
        >
          <div style={{ width: "60%" }}>
            <p style={{ fontWeight: 500, fontSize: "16px", color: "black" }}>
              Form Name
            </p>
          </div>
          <p style={{ fontWeight: 500, fontSize: "16px", color: "black" }}>
            Creation Date
          </p>
        </div>
        <div>
          {forms.length === 0 ? (
            <p
              style={{
                fontWeight: 400,
                color: "black",
                fontSize: "18px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              No forms found
            </p>
          ) : (
            forms?.map((form) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10%",
                  borderBottom: "1px solid black",
                  paddingBottom: "8px",
                  paddingTop: "8px",
                }}
              >
                <div style={{ width: "60%" }}>
                  <Link to={`/preview/${form?.id}`}>
                    <p
                      style={{
                        fontWeight: 500,
                        fontSize: "16px",
                        color: "black",
                        cursor: "pointer",
                      }}
                    >
                      {form.formName}
                    </p>
                  </Link>
                </div>
                <p
                  style={{
                    fontWeight: 500,
                    fontSize: "16px",
                    color: "black",
                  }}
                >
                  {new Date(form.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ViewAllForm;
