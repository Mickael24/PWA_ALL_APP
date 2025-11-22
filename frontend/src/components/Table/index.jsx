import { Table as TableReact } from "reactstrap";
import _ from "lodash";

const Table = ({ columns = [], rows = {
    data: [],
    pagination: {}
}}) => {
  return (
    <TableReact hover>
      <thead>
        <tr>
          {columns.map((colum, index) => (
            <th key={`${index}_${colum}`}>{colum}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.data.map((row, index) => {
          return (
            <tr key={`${row.id}_row`}>
            {
                columns.map((column) => {
                    return <td key={`${column}_row_column`}>{_.get(row, column)}</td>;
                })
            }
            </tr>
          );
        })}
      </tbody>
    </TableReact>
  );
};

export default Table;
