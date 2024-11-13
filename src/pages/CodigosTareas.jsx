import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useGlobal } from "../context/Global/GlobalContext";
import { MainTitle } from "../components/Titles";
import IconsTask from "../assets/spreadsheet.png";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function CodigoTareas() {
  const [filterData, setFilterData] = useState([]);
  const { codigos, getCodigos } = useGlobal();
  useEffect(() => {
    getCodigos();
  }, []);
  useEffect(() => {
    setFilterData(codigos);
  }, [codigos]);
  const customStyles = {
    headCells: {
      style: {
        fontSize: "1rem",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        fontSize: "0.95rem",
      },
    },
  };
  const options = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
  };
  const columns = [
    {
      name: "Código",
      width: "150px",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Descripción de tarea",
      selector: (row) => row.nombre,
      sortable: true,
    },
  ];
  return (
    <div className="mt-4 text-center">
      <MainTitle title="Códigos de Tareas" urlIcon={IconsTask} />
      <Form.Group className="my-3">
        <Form.Control type="text" placeholder="Ingrese un nombre de tarea" onInput={(e) => {
          const filter = codigos.filter((cod) =>
            cod.nombre.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setFilterData(filter);
        }}/>
      </Form.Group>
      <DataTable
        className="custom-element"
        columns={columns}
        data={filterData}
        customStyles={customStyles}
        pagination
        paginationPerPage={10}
        paginationComponentOptions={options}
        highlightOnHover
      />
    </div>
  );
}
