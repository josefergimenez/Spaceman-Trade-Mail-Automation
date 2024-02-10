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
    <div className="flex border-2 bg-[#F6F6F4] border-primary">
        <table>
            <tbody>
                <tr>
                    <td rowSpan={Math.ceil(beers.length / 2)}
                        className="text-center text-4xl font-bold text-primary">
                    {zone}
                    </td>
                </tr>
                {beers.slice(0, Math.ceil(beers.length / 2)).map((beer, index) => {
                    if (index % 2 === 0) {
                        return (
                        <Fragment>                            <tr key={index}>
                                <td className="flex">
                               <img 
                        className="h-32 w-auto" 
                        src="https://fastly.picsum.photos/id/826/200/400.jpg?hmac=VvENoX-lY-uCXQ0bbTUOiRj3g7hlI1hxVek3LQ-htuA"
                        alt={beer.id} />{beer.price} Gs</td>
                                <td>
                        <img 
                        className="h-32 w-auto" 
                        src="https://fastly.picsum.photos/id/826/200/400.jpg?hmac=VvENoX-lY-uCXQ0bbTUOiRj3g7hlI1hxVek3LQ-htuA"
                        alt={beer.id} />
                                {beers[index + 1].price ?
                                beers[index + 1].price : ''} Gs</td>
                            </tr>
                        </Fragment>
                        );
                    }
                    return null;
                })}
            </tbody>
        </table>
    </div>
    )}

export default DispersionImage
