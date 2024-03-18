import { Fragment } from "react"
import { BeerDispersion } from "../types"

type Props = {
    zone: string,
    beers: BeerDispersion[]
}

const DispersionImage: React.FC<Props> = ({
    zone,
    beers
    }) => {
    
    return (
    <div className="flex border-2 bg-[#F6F6F4] border-primary w-[600px] mt-5">
        <table className="w-full">
            <tbody>
                <tr>
                    <td rowSpan={5}
                        className="text-center text-4xl font-bold text-primary w-2/5">
                    {zone}
                    </td>
                </tr>
                <tr>
                    <td>
                        <img 
                            className="h-32 w-auto" 
                            src="/21178.png"
                            />
                    </td>                    
                <td className="text-center text-xl font-bold text-primary ">{beers[0].price} Gs.</td>
                    <td>
                        <img 
                            className="h-32 w-auto" 
                            src="/21167.png"
                            />
                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[1].price} Gs.</td>
                </tr>
                <tr >
                    <td>
                        <img 
                            className="h-32 w-auto" 
                            src="/21189.png"
                            />

                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[2].price} Gs.</td>
                    <td>
                        <img 
                            className="h-32 w-auto" 
                            src="/21150.png"
                            />

                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[3].price} Gs.</td>
                </tr>
                <tr>
                    <td>
                        <img 
                            className="h-32 w-auto mt-12" 
                            src="/21181.png"
                            />

                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[4].price} Gs.</td>
                    <td>
                        <img 
                            className="h-32 w-auto mt-12" 
                            src="21187.png"
                            />

                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[5].price} Gs.</td>
                </tr>
                <tr>
                    <td>
                        <img 
                            className="h-32 w-auto mt-12" 
                            src="21170.png"
                            />

                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[6].price} Gs.</td>
                    <td>
                        <img 
                            className="h-32 w-auto mt-12" 
                            src="21175.png"
                            />

                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[7].price} Gs.</td>
                </tr>
            </tbody>
        </table>
    </div>
    )}

export default DispersionImage
