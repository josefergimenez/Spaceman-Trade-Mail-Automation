import { Beer } from "../types";

type Props = {
    beers:  Beer[];
    zone: string
}

const AlertCard: React.FC<Props> = ({
    beers,
    zone
    }) => {  
        return (
        <div className="flex border-2 bg-[#F6F6F4] border-primary">
            <div className="w-2/5 text-center items-center justify-center flex text-4xl font-bold text-primary">
                {zone}
            </div>
            <div className="w-3/5">
                {beers.map((beer) => (
                  <div key={beer.id} className="flex items-center mb-4">
                  <table>
                  <tbody>
                    <tr>
                        <td rowSpan={3} className="align-middle">
                        <img 
                        className="h-32 w-auto" 
                        src="https://fastly.picsum.photos/id/826/200/400.jpg?hmac=VvENoX-lY-uCXQ0bbTUOiRj3g7hlI1hxVek3LQ-htuA"
                        alt={beer.id} />
                        </td>
                        <td 
                          rowSpan={3}
                          className={`text-4xl font-extrabold text-center align-middle pl-2 ${
                            beer.percentage < 80 ? 'text-red-600' : 
                            beer.percentage >= 80 && beer.percentage <= 85 ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}
                        >
                        {beer.percentage}%
                        </td>
                        <td rowSpan={2}></td>
                    </tr>
                    <tr></tr>
                    <tr>
                    <td className="align-bottom">
                    <div className="pb-4">                 
                      <span className={`${beer.pp > 0 ? 'text-green-600' :
                        beer.pp == 0 ? 'text-yellow-600' :
                        'text-red-600'} text-xl font-bold`}>
                        {beer.pp > 0 ? '+' : ''}{beer.pp} PP
                      </span>
                    </div>
                    </td>
                    </tr>
                  </tbody>
                </table>
                </div> 
                ))}
            </div>
        </div>
        )
    }

export default AlertCard;
