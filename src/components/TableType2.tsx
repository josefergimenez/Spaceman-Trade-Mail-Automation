import { Fragment } from "react";
import { ClusterWithProducts } from "../types";
import { calculateColor } from "./helper";

type Props = {
    title: string,
    data: ClusterWithProducts,
    fromDate: string,
    toDate: string
}

const TableType2: React.FC<Props> = ({
    title,
    data,
    fromDate,
    toDate
}) => { 

        return (

    <table className="border-2 border-black border-collapse">
        <thead className="bg-[#042362] text-white text-sm">
            <tr className="border-2 border-black border-collapse text-left">
                <th colSpan={4}>{title}</th>
            </tr>

        </thead>
        <tbody>
            {data.zone.map((cluster, i) => (
                <Fragment key={i}>
                    <tr className="border-2 border-black border-collapse bg-[#042362] text-white text-xs">
                        <th>{cluster.name}</th>
                        <td>{fromDate}</td>
                        <td>{toDate}</td>
                        <td>VARIACION</td>
                    </tr>
                    {cluster.product.map((product, index) => (
                        <tr key={index}>
                            <td className="text-left text-sm">{product.name}</td>
                            <td className="text-right text-sm"
                                style={{ backgroundColor: calculateColor(product.percentageOne) }}
                            >{product.percentageOne}%</td>
                            <td className="text-right text-sm"
                                style={{ backgroundColor: calculateColor(product.percentageTwo) }}
                            >{product.percentageTwo}%</td>
                            <td className="text-right text-sm">{product.pp} p.p.</td>
                        </tr>
                    ))}
                </Fragment>
            ))}
        </tbody>
    </table>
)}
export default TableType2;
