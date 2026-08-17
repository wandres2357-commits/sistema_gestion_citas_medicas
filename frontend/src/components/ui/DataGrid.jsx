import {
  useMemo,
  useState,
  useEffect
} from "react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import "./DataGrid.css";

export default function DataGrid({

  rows = [],
  columns = [],
  onRowDoubleClick

}) {

  const pageSizeOptions = [
    10,
    20,
    50,
    100
  ];

  const [
    filtros,
    setFiltros
  ] = useState({});

  const [
    paginaActual,
    setPaginaActual
  ] = useState(1);

  const [
    sortField,
    setSortField
  ] = useState(null);
  
  const [
    sortDirection,
    setSortDirection
  ] = useState("asc");

  const [
    registrosPorPagina,
    setRegistrosPorPagina
  ] = useState(10);

  useEffect(() => {
    setPaginaActual(1);
  }, [
    filtros,
    registrosPorPagina
  ]);

  function ordenarPorCampo(
    field) {
        if (sortField === field
        ) 
        {
            setSortDirection(
                sortDirection === "asc"
                ? "desc"
                : "asc"
            );
            return;
        }
        setSortField(field);
        setSortDirection("asc");
    }
  const registrosFiltrados =
    useMemo(() => {

      return rows.filter(
        (row) => {

          return columns.every(
            (column) => {

              const valor =
                String(
                  row[
                    column.field
                  ] || ""
                ).toLowerCase();

              const filtro =
                String(
                  filtros[
                    column.field
                  ] || ""
                ).toLowerCase();

              return valor.includes(
                filtro
              );
            }
          );
        }
      );
    },
    [
      rows,
      columns,
      filtros
    ]);
    const registrosOrdenados =
    useMemo(() => {
        if (!sortField) {
      return [
        ...registrosFiltrados
      ];
    }
    return [
      ...registrosFiltrados
    ].sort(
      (a, b) => {
        const valorA =
          String(
            a[sortField] || ""
          ).toLowerCase();
        const valorB =
          String(
            b[sortField] || ""
          ).toLowerCase();
        if (
          sortDirection === "asc"
        ) {
          return valorA.localeCompare(
            valorB
          );
        }
        return valorB.localeCompare(
          valorA
        );
      }
    );
  }, [
    registrosFiltrados,
    sortField,
    sortDirection
  ]);

  const totalPaginas =
    Math.max(
      1,
      Math.ceil(
        registrosOrdenados.length /
        registrosPorPagina
      )
    );

  const registrosPaginados =
    registrosOrdenados.slice(
      (
        paginaActual - 1
      ) * registrosPorPagina,

      paginaActual *
      registrosPorPagina
    );

  return (

    <>

      <table className="admin-crud-table">
        <thead>
          <tr>
            {
              columns.map(
                (column) => (
                <th
                key={
                    column.field
                }
                style={{
                    cursor: "pointer"
                }}
                onClick={() =>
                    ordenarPorCampo(
                        column.field
                    )}
                    >
                        {column.title}
                        {" "}
                        {sortField === column.field && (
                            <span>
                                {sortDirection === "asc"
                                ? "▲"
                                : "▼"}
                            </span>
                        )}
                </th>
                ))
                }
          </tr>
          <tr>
            {
              columns.map(
                (column) => (
                  <th
                    key={
                      column.field
                    }
                  >
                    <Input
                      placeholder={`Buscar ${column.title}`}
                      value={
                        filtros[
                          column.field
                        ] || ""
                      }
                      onChange={(e) =>
                        setFiltros({
                          ...filtros,

                          [column.field]:
                            e.target.value
                        })
                      }
                    />
                  </th>
                ))
            }
          </tr>
        </thead>
        <tbody>
          {
            registrosPaginados.length === 0 &&
            (
              <tr>
                <td
                  colSpan={
                    columns.length
                  }
                  style={{
                    textAlign:
                      "center"
                  }}
                >
                  No existen registros
                </td>

              </tr>
            )
          }

          {
            registrosPaginados.map(
              (row) => (

                <tr
                  key={row.id}
                  style={{
                    cursor:
                      "pointer"
                  }}
                  onDoubleClick={() =>
                    onRowDoubleClick?.(row)
                  }
                >
                  {
                    columns.map(
                      (column) => (

                        <td
                          key={
                            column.field
                          }
                        >
                          {
                            row[
                              column.field
                            ]
                          }
                        </td>
                      )
                    )
                  }
                </tr>
              )
            )
          }
        </tbody>
      </table>

      <div className="dg-footer">

        <div className="dg-left">
          Mostrando
          {" "}
          {
            registrosPaginados.length
          }
          {" "}
          de
          {" "}
          {
            registrosOrdenados.length
          }
          registros
        </div>

        <div className="dg-center">
          <span>
            Registros por página
          </span>
          <select
  className="dg-page-size"
  value={registrosPorPagina}
  onChange={(e) =>
    setRegistrosPorPagina(
      Number(
        e.target.value
      )
    )
  }
>
  <option value={10}>
    10
  </option>

  <option value={20}>
    20
  </option>

  <option value={50}>
    50
  </option>

  <option value={100}>
    100
  </option>
</select>

        </div>

        <div className="dg-pagination">
            <Button
  variant="secondary"
  disabled={
    paginaActual === 1
  }
  onClick={() =>
    setPaginaActual(
      paginaActual - 1
    )
  }
>
  ◀
</Button>

<span>
  Página
  {" "}
  {paginaActual}
  {" "}
  de
  {" "}
  {totalPaginas}
</span>

<Button
  variant="secondary"
  disabled={
    paginaActual ===
    totalPaginas
  }
  onClick={() =>
    setPaginaActual(
      paginaActual + 1
    )
  }
>
  ▶
</Button>

</div>

</div>
          

    </>
  );
}