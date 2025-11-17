import { ICustomTooltipProps, IPayload } from "./types";

export const ChartTooltip = <T = string | number | object,>({
  props,
  units,
}: {
  props: ICustomTooltipProps<T>;
  units: string[];
}) => {
  if (
    !props.active ||
    !props.payload ||
    (props.payload as IPayload<T>[]).length === 0
  )
    return null;
  // Hide tooltip if label is 'Unknown' and all values are 0
  const items = props.payload ? [...(props.payload as IPayload<T>[])] : [];
  const allZero = items.every((pl) => pl.value === 0);
  if (props.label === "Unknown" && allZero) return null;

  return (
    <div className="chart-tooltip visible">
      <table className="content">
        <tbody>
          <tr className="line">
            <td>{props.label}</td>
            <td className="right-align">{units.length <= 1 ? units[0] : ""}</td>
          </tr>
          <tr>
            <td colSpan={2} className="divider"></td>
          </tr>
          {items.map((pl: IPayload<T>, index: number) => {
            // Extract series name from payload when dataKey is a function
            const seriesName =
              typeof pl.dataKey === "function"
                ? Object.keys(pl.payload || {}).find((key) => key !== "name") ||
                  "Unknown"
                : pl.dataKey;

            return (
              <tr key={`${seriesName}${index}`} className="item">
                <td>
                  <span>{seriesName}</span>
                </td>
                <td className="right-align">
                  <span>
                    {pl.value as number} {units.length > 1 && units[index]}{" "}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
