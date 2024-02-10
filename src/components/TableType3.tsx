import { Cluster } from "../types";

type Props = {
    title: string,
    zone: string,
    fromDate: string,
    toDate: string,
    clusters: Cluster[] 
}

const TableType3: React.FC<Props> = ({
    title,
    zone,
    fromDate,
    toDate,
    clusters
}) => {  
        return (
    <table>
        <thead>
            <tr>
                <th colSpan={4}>{title}</th>
            </tr>
            <tr>
                <th colSpan={4}>{zone}</th>
            </tr>
        </thead>
        <tbody>
           <tr>
            <td></td>
            <td>{fromDate}</td>
            <td>{toDate}</td>
            <td>VARIACION</td>
           </tr>
            {clusters.map((cluster, index) => (
                <tr key={index}>
                    <td>{cluster.name}</td>
                    <td>{cluster.percentageOne}</td>
                    <td>{cluster.percentageTwo}</td>
                    <td>{cluster.pp}</td>
                </tr>
            ))} 
        </tbody>
    </table>
)}
export default TableType3;
