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
        <div className="flex border-2 bg-[#F6F6F4] border-primary mt-2 w-[600px]">
            <div className="w-2/5 text-center items-center justify-center flex text-3xl font-bold text-primary">
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
                        src={getUrlPorId(beer.id)}
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

const NAMES: { [key: string]: string } = {
    21170: "/21170.png",
    21175: "/21175.png",
    21181: "/21181.png",
    21187: "/21187.png",
    21167: "/21167.png",
    22350: "/22350.png",
    21178: "/21178.png",
    21189: "/21189.png",
};

function getUrlPorId(id: string): string{
    return NAMES[id] || "https://fastly.picsum.photos/id/826/200/400.jpg?hmac=VvENoX-lY-uCXQ0bbTUOiRj3g7hlI1hxVek3LQ-htuA";
}
