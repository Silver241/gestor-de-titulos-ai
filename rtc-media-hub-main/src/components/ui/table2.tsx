import * as React from "react";

type Align = "left" | "center" | "right";

export type Table2Column<T> = {
  /** Id único da coluna (também usado como key) */
  id: string;

  /** Cabeçalho (texto ou JSX) */
  header: React.ReactNode;

  /** Como buscar o valor no objeto (opcional se usares cell()) */
  accessor?: keyof T | ((row: T) => any);

  /** Render custom da célula (prioridade máxima) */
  cell?: (row: T, value: any, rowIndex: number) => React.ReactNode;

  /** Classes custom */
  headerClassName?: string;
  cellClassName?: string | ((row: T, value: any, rowIndex: number) => string);

  /** Estilo/Config */
  align?: Align;
  width?: string | number; // ex: 120, "15%", "12rem"
  hideOnMobile?: boolean;
};

export type Table2Props<T> = {
  columns: Array<Table2Column<T>>;
  data: T[];

  /** Offset do sticky header (em px) para não sobrepor o navbar (ex: 56 para h-14) */
  stickyOffset?: number;

  /** Key única por linha (recomendado: id) */
  rowKey?: keyof T | ((row: T, rowIndex: number) => string | number);

  /** Estado */
  isLoading?: boolean;
  emptyText?: React.ReactNode;

  /** Interação */
  onRowClick?: (row: T, rowIndex: number) => void;
  rowClassName?: string | ((row: T, rowIndex: number) => string);

  /** Ações (coluna extra opcional) */
  actions?: (row: T, rowIndex: number) => React.ReactNode;
  actionsHeader?: React.ReactNode;

  /** Visual */
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  stickyHeader?: boolean;

  /** Pequenos ajustes */
  dense?: boolean; // reduz padding
  zebra?: boolean; // linhas alternadas
};

function cn(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

function getAlignClass(align?: Align) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

function getValue<T>(row: T, accessor?: keyof T | ((row: T) => any)) {
  if (!accessor) return undefined;
  if (typeof accessor === "function") return accessor(row);
  return (row as any)[accessor];
}

export function Table2<T>({
  columns,
  data,
  stickyOffset = 0,
  rowKey,
  isLoading,
  emptyText = "Sem dados para mostrar.",
  onRowClick,
  rowClassName,
  actions,
  actionsHeader = "Ações",
  className,
  tableClassName,
  headerClassName,
  bodyClassName,
  stickyHeader,
  dense,
  zebra,
}: Table2Props<T>) {
  const resolvedRowKey = React.useCallback(
    (row: T, rowIndex: number) => {
      if (!rowKey) return rowIndex;
      if (typeof rowKey === "function") return rowKey(row, rowIndex);
      return (row as any)[rowKey] ?? rowIndex;
    },
    [rowKey]
  );

  const paddingY = dense ? "py-2" : "py-3";
  const paddingX = dense ? "px-3" : "px-4";

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
        <table className={cn("w-full border-collapse", tableClassName)}>
          <thead
            className={cn(
              "bg-muted/40",
              stickyHeader &&
                "sticky z-10 backdrop-blur supports-[backdrop-filter]:bg-muted/50",
              headerClassName
            )}
            style={stickyHeader ? { top: stickyOffset } : undefined}
          >
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    paddingY,
                    paddingX,
                    getAlignClass(col.align),
                    col.hideOnMobile && "hidden md:table-cell",
                    col.headerClassName
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}

              {actions && (
                <th
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    paddingY,
                    paddingX,
                    "text-right"
                  )}
                  style={{ width: "1%" }}
                >
                  {actionsHeader}
                </th>
              )}
            </tr>
          </thead>

          <tbody className={cn(bodyClassName)}>
            {/* Loading */}
            {isLoading && (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className={cn(
                    "text-sm text-muted-foreground",
                    paddingY,
                    paddingX
                  )}
                >
                  A carregar...
                </td>
              </tr>
            )}

            {/* Empty */}
            {!isLoading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className={cn(
                    "text-sm text-muted-foreground",
                    paddingY,
                    paddingX
                  )}
                >
                  {emptyText}
                </td>
              </tr>
            )}

            {/* Rows */}
            {!isLoading &&
              data.map((row, rowIndex) => {
                const clickable = !!onRowClick;
                const extraRowClass =
                  typeof rowClassName === "function"
                    ? rowClassName(row, rowIndex)
                    : rowClassName;

                return (
                  <tr
                    key={String(resolvedRowKey(row, rowIndex))}
                    onClick={
                      clickable ? () => onRowClick?.(row, rowIndex) : undefined
                    }
                    className={cn(
                      "border-b border-border last:border-b-0",
                      zebra && rowIndex % 2 === 1 && "bg-muted/20",
                      clickable && "cursor-pointer hover:bg-muted/30",
                      extraRowClass
                    )}
                  >
                    {columns.map((col) => {
                      const value = getValue(row, col.accessor);
                      const content = col.cell
                        ? col.cell(row, value, rowIndex)
                        : (value as any);

                      const cellExtra =
                        typeof col.cellClassName === "function"
                          ? col.cellClassName(row, value, rowIndex)
                          : col.cellClassName;

                      return (
                        <td
                          key={col.id}
                          className={cn(
                            "text-sm text-foreground",
                            paddingY,
                            paddingX,
                            getAlignClass(col.align),
                            col.hideOnMobile && "hidden md:table-cell",
                            cellExtra
                          )}
                          style={col.width ? { width: col.width } : undefined}
                        >
                          {content ?? (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      );
                    })}

                    {actions && (
                      <td
                        className={cn(
                          "text-sm",
                          paddingY,
                          paddingX,
                          "text-right"
                        )}
                      >
                        {/* evita que clicar num botão dispare onRowClick */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2"
                        >
                          {actions(row, rowIndex)}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
