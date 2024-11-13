import { Form, Row, Col, Table, Button } from "react-bootstrap/";
import { useForm, useFieldArray } from "react-hook-form";
import { useGlobal } from "../context/Global/GlobalContext";
import { useEffect, useState } from "react";
import TextWarningForm from "../components/TextWarningForm";
import { ModalComponent } from "../components/ModalComponent";
import LoadingIcon from "../components/LoaderIcon";
export default function Home() {
  const [subsectores, setSubsectores] = useState([]);
  const {
    orders,
    getOrders,
    sectors,
    getSectors,
    empleados,
    getEmpleados,
    postTasks,
    handleModalShow,
  } = useGlobal();
  useEffect(() => {
    getOrders();
    getSectors();
    getEmpleados();
  }, []);
  const size = "sm";
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      tasks: [
        {
          tipo_orden: "",
          nro: "",
          cod_tarea: "",
          inicio: "07:00",
          fin: "",
          subsector: "",
          comentario: "No aplica",
          cant_pieza: "",
          reproceso: "No",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });
  const onSubmit = async (data) => {
    handleModalShow("modal-loading");
    const res = await postTasks(data);
    if (res.some((item) => item === undefined)) {
      handleModalShow("modal-error");
    } else {
      handleModalShow("modal-success");
      reset();
    }
    console.log(res);
  };
  const onError = (errors) => {
    console.error("Form errors:", errors);
  };
  return (
    <>
      <Form className="mt-5" onSubmit={handleSubmit(onSubmit, onError)}>
        <Row className="g-1">
          <Form.Group className="mb-3" as={Col} sm={2}>
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              {...register("fecha", {
                required: {
                  value: true,
                  message: "Debe ingresar la fecha de las actividades",
                },
              })}
            />
            {errors.fecha && <TextWarningForm message={errors.fecha.message} />}
          </Form.Group>
          <Form.Group className="mb-3" as={Col}>
            <Form.Label>Operario</Form.Label>
            <Form.Select
              {...register("operador_alias", {
                required: {
                  value: true,
                  message: "Seleccione un Operario",
                },
              })}
            >
              <option value=""></option>
              {empleados.map((item, index) => {
                return (
                  <option key={`${item.alias}-${index}`} value={item.alias}>
                    {`[${item.alias}] - ${item.nombre} ${item.apellido}`}
                  </option>
                );
              })}
            </Form.Select>
            {errors.operador_alias && <TextWarningForm message={errors.operador_alias.message} />}
          </Form.Group>
          <Form.Group className="mb-3" as={Col} sm={"auto"}>
            <Form.Label>Sector</Form.Label>
            <Form.Select
              {...register("sector", {
                required: {
                  value: true,
                  message: "Seleccione un Sector",
                },
                onChange: () => {
                  setSubsectores(
                    sectors.data.filter(
                      (item) => item.sector === watch("sector")
                    )
                  );
                },
              })}
            >
              <option value=""></option>
              {sectors.sectores.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </Form.Select>
            {errors.sector && (
              <TextWarningForm message={errors.sector.message} />
            )}
          </Form.Group>
        </Row>
        <hr />
        <Row className="g-1">
          <div className="d-flex justify-content-between">
            <h3>Tiempos de trabajo</h3>
            <button
              type="button"
              onClick={() => {
                append({
                  tipo_orden: "",
                  nro: "",
                  cod_tarea: "",
                  inicio: watch(`tasks.${fields.length - 1}.fin`),
                  fin: "",
                  subsector: "",
                  comentario: "No aplica",
                  cant_pieza: "",
                  reproceso: "No",
                });
              }}
              className="btn btn-success"
            >
              {" "}
              Agregar <i className="bi bi-plus-lg"></i>
            </button>
          </div>

          <Table className="mt-3" size="sm">
            <thead>
              <tr>
                <th style={{ width: "auto" }}>Tipo Orden</th>
                <th style={{ width: "120px" }}>Nro. Orden</th>
                <th style={{ width: "98px" }}>Cod. Tarea</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Subsector</th>
                <th>Desvío</th>
                <th style={{ width: "90px" }}>Cant. Pza</th>
                <th>Reproceso</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Form.Select
                        size={size}
                        {...register(`tasks.${index}.tipo_orden`, {
                          required: true,
                          onChange: () => {
                            setValue(`tasks.${index}.nro`, "");
                            if (watch(`tasks.${index}.tipo_orden`) === "N/A") {
                              setValue(`tasks.${index}.nro`, "-");
                            }
                          },
                        })}
                      >
                        <option value=""></option>
                        {orders.map((item, index) => {
                          return (
                            <option key={index} value={item.abreviatura}>
                              {item.nombre}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        size={size}
                        type="text"
                        {...register(`tasks.${index}.nro`, {
                          required: true,
                          disabled:
                            watch(`tasks.${index}.tipo_orden`) === "N/A",
                        })}
                      />
                    </td>
                    <td>
                      <Form.Control
                        size={size}
                        type="number"
                        {...register(`tasks.${index}.cod_tarea`, {
                          required: true,
                        })}
                      />
                    </td>
                    <td>
                      <Form.Control
                        size={size}
                        type="time"
                        {...register(`tasks.${index}.inicio`, {
                          required: true,
                        })}
                      />
                    </td>
                    <td>
                      <Form.Control
                        size={size}
                        type="time"
                        {...register(`tasks.${index}.fin`, {
                          required: true,
                          validate: (value) => {
                            return (
                              watch(`tasks.${index}.inicio`) != value ||
                              "No pueden ser iguales los tiempos de inico y fin"
                            );
                          },
                        })}
                      />
                    </td>
                    <td>
                      <Form.Select
                        size={size}
                        {...register(`tasks.${index}.subsector`, {
                          required: true,
                        })}
                      >
                        <option value=""></option>
                        {subsectores.map((item) => (
                          <option
                            key={`${item.subsector}`}
                            value={item.subsector}
                          >
                            {item.subsector}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        size={size}
                        type="text"
                        {...register(`tasks.${index}.comentario`, {
                          required: true,
                        })}
                      />
                    </td>
                    <td>
                      <Form.Control
                        size={size}
                        type="number"
                        {...register(`tasks.${index}.cant_pieza`, {
                          required: true,
                        })}
                      />
                    </td>
                    <td>
                      <Form.Select
                        size={size}
                        {...register(`tasks.${index}.reproceso`, {
                          required: true,
                        })}
                      >
                        <option value={false}>No</option>
                        <option value={true}>Sí</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => remove(index)}
                        tabIndex={-1}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {errors.tasks && console.log(errors.tasks)}
          {errors.tasks && (
            <TextWarningForm message="Todos los campos son obligatorios" />
          )}
        </Row>
        <Row className="mt-3">
          <Col>
            <Button
              type="submit"
              {...register("form", {
                validate: () => {
                  return (
                    watch("tasks").length > 0 || "Debe agregar una actividad"
                  );
                },
              })}
            >
              Guardar
            </Button>
          </Col>
          {errors.form && <TextWarningForm message={errors.form.message} />}
        </Row>
      </Form>
      <ModalComponent
        modalId="modal-loading"
        title="Procesando"
        body={<LoadingIcon />}
        showButtonsClose={false}
      />
      <ModalComponent
        modalId="modal-error"
        title="Error"
        body={
          <div>
            <p>Hubo un error al guardar la orden.</p>
            <p>Por favor, intente nuevamente.</p>
          </div>
        }
        showButtonsClose={true}
      />
      <ModalComponent
        modalId="modal-success"
        title="Proceso exitoso"
        body={
          <div>
            <p>Se han guardado las horas exitosamente</p>
          </div>
        }
        showButtonsClose={true}
      />
    </>
  );
}
