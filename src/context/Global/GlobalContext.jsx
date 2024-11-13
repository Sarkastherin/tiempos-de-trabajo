import { createContext, useContext, useReducer } from "react";
import { GlobalReducer } from "./GlobalReducer";
import { GoogleSheet, Email } from "../../API/AuthGoogle";

const OrdenesGoogleSheet = new GoogleSheet({
  sheetId: import.meta.env.VITE_SS,
  nameSheet: "Tipos de órdenes",
  rowHead: 1,
});
const ActividadesGoogleSheet = new GoogleSheet({
  sheetId: import.meta.env.VITE_SS,
  nameSheet: "Actividades",
  rowHead: 1,
});
const SectoresGoogleSheet = new GoogleSheet({
  sheetId: import.meta.env.VITE_SS,
  nameSheet: "Sectores y Subsectores",
  rowHead: 1,
});
const EmpleadosGoogleSheet = new GoogleSheet({
  sheetId: import.meta.env.VITE_SS,
  nameSheet: "Lista de Empleados",
  rowHead: 1,
});
const CodigosGoogleSheet = new GoogleSheet({
  sheetId: import.meta.env.VITE_SS,
  nameSheet: "Códigos de tareas",
  rowHead: 1,
});
const GlobalContext = createContext();
export const useGlobal = () => useContext(GlobalContext);

export function GlobalProvider({ children }) {
  const initialState = {
    orders: [],
    sectors: { data: [], sectores: [] },
    empleados: [],
    activeModal: null,
    codigos: [],
  };
  const [state, dispatch] = useReducer(GlobalReducer, initialState);
  const handleModalClose = () => {
    dispatch({
      type: "HANDLE_ACTIVE_MODAL",
      payload: null,
    });
  };
  const handleModalShow = (modalId) => {
    dispatch({
      type: "HANDLE_ACTIVE_MODAL",
      payload: modalId,
    });
  };
  const getOrders = async () => {
    const data = await OrdenesGoogleSheet.getData();
    dispatch({
      type: "GET_ORDERS",
      payload: data,
    });
  };
  const getSectors = async () => {
    const data = await SectoresGoogleSheet.getData();
    const sectores = [...new Set(data.map(item => item.sector))];
    dispatch({
      type: "GET_SECTORS",
      payload: { data: data, sectores: sectores },
    });
  };
  const getEmpleados = async () => {
    const data = await EmpleadosGoogleSheet.getData();
    const empleadosProd = data.filter(
      (item) => item.inactivo === false
    );
    dispatch({
      type: "GET_EMPLEADOS",
      payload: empleadosProd,
    });
  };
  const postTasks = async (data) => {
    const emailAddress = await Email.getEmail();
    const lastId = await ActividadesGoogleSheet.getLastId();
    const newTasks = data.tasks.map((item, index) => {
      item.operador_alias = data.operador_alias;
      item.fecha = data.fecha;
      item.registrado_por = emailAddress
      item.id = lastId + index + 1;
      return item;
    });
    const response = Promise.all(newTasks.map(async (task) => {
        return await ActividadesGoogleSheet.postData(task);
    }));
    return response
  };
  const getCodigos = async () => {
    const data = await CodigosGoogleSheet.getData();
    dispatch({
      type: "GET_CODIGOS",
      payload: data,
    });
  };
  return (
    <GlobalContext.Provider
      value={{
        orders: state.orders,
        getOrders,
        sectors: state.sectors,
        getSectors,
        empleados: state.empleados,
        getEmpleados,
        postTasks,
        handleModalClose,
        handleModalShow,
        activeModal: state.activeModal,
        codigos: state.codigos,
        getCodigos,
        
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
