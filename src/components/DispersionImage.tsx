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
                            src="https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/dfd2e38e-4a82-0c8a-19ac-e3aab4254468.png"
                            />
                    </td>                    
                <td className="text-center text-xl font-bold text-primary ">{beers[0].price} Gs.</td>
                    <td>
                        <img 
                            className="h-32 w-auto" 
                            src="https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/a8fc35d6-15f5-3bfc-07ff-ada88dd130a6.png"
                            />
                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[1].price} Gs.</td>
                </tr>
                <tr >
                    <td>
                        <img 
                            className="h-32 w-auto" 
                            src="https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/0b35f388-1910-3cc3-2465-48b9d629b770.png"
                            />

                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[2].price} Gs.</td>
                    <td>
                        <img 
                            className="h-32 w-auto" 
                            src="https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/272967a3-495c-2b18-a8a0-4796dfbd3446.png"
                            />

                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[3].price} Gs.</td>
                </tr>
                <tr>
                    <td>
                        <img 
                            className="h-32 w-auto mt-12" 
                            src="https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/dd429c80-ee5d-5240-491e-fa5084b94154.png"
                            />

                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[4].price} Gs.</td>
                    <td>
                        <img 
                            className="h-32 w-auto mt-12" 
                            src="https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/2848da88-cb23-cd4b-a3b6-7fd980019c7f.png"
                            />

                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[5].price} Gs.</td>
                </tr>
                <tr>
                    <td>
                        <img 
                            className="h-32 w-auto mt-12" 
                            src="https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/ee0dcf02-6a37-ed9e-d75b-709a27823d99.png"
                            />

                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[6].price} Gs.</td>
                    <td>
                        <img 
                            className="h-32 w-auto mt-12" 
                            src="https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/33a3bed5-c943-9c0b-caae-8227778e6889.png"
                            />

                    </td>
                    <td className="text-center text-xl font-bold text-primary">{beers[7].price} Gs.</td>
                </tr>
            </tbody>
        </table>
    </div>
    )}

export default DispersionImage
