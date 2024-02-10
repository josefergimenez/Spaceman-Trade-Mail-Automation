import { Cluster } from "../types";
import { calculateColor } from "./helper";

type Props = {
    title: string,
    zone: string,
    fromDate: string,
    toDate: string,
    clusters: Cluster[] 
}

const TableType1: React.FC<Props> = ({
    title,
    zone,
    fromDate,
    toDate,
    clusters
}) => { 

        return (

    <table className="border-2 border-black border-collapse">
        <thead className="bg-[#042362] text-white text-sm">
            <tr className="border-2 border-black border-collapse">
                <th colSpan={4}>{title}</th>
            </tr>
            <tr className="border-2 border-black border-collapse">
                <th colSpan={4}>{zone}</th>
            </tr>
        </thead>
        <tbody>
           <tr className="border-2 border-black border-collapse bg-[#042362] text-white text-xs">
            <td></td>
            <td>{fromDate}</td>
            <td>{toDate}</td>
            <td>VARIACION</td>
           </tr>
            {clusters.map((cluster, index) => (
                <tr key={index}>
                    <td className="text-left text-sm">{cluster.name}</td>
                    <td className="text-right text-sm"
                        style={{ backgroundColor: calculateColor(cluster.percentageOne) }}
                    >{cluster.percentageOne}%</td>
                    <td className="text-right text-sm"
                        style={{ backgroundColor: calculateColor(cluster.percentageTwo) }}
                        >{cluster.percentageTwo}%</td>
                    <td className="text-right text-sm">{cluster.pp} p.p.</td>
                </tr>
            ))} 
        </tbody>
    </table>
)}
export default TableType1;

