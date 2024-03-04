import { Fragment } from "react";
import { ClusterWithProducts } from "../types";
import { Arrow, calculateColor } from "./helper";

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

    <table className="border-2 border-black border-collapse mt-2 w-[600px]">
        <thead className="bg-[#042362] text-white text-sm">
            <tr className="border-2 border-black border-collapse text-left">
                <th colSpan={4}>{title}</th>
            </tr>

        </thead>
        <tbody>
            {data.zone.map((cluster, i) => (
                <Fragment key={i}>
                    <tr className="border-2 border-black border-collapse bg-[#042362] text-white text-xs">
                        <th className="w-1/2">{cluster.name}</th>
                        <td className="w-1/6">{fromDate}</td>
                        <td className="w-1/6">{toDate}</td>
                        <td className="w-1/6">VARIACION</td>
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
                    <td className="flex justify-between">
                        <Arrow pp={String(product.pp)}/>
                        <div className="text-right text-sm">{product.pp} p.p.</div></td>
                        </tr>
                    ))}
                </Fragment>
            ))}
        </tbody>
    </table>
)}
export default TableType2;
