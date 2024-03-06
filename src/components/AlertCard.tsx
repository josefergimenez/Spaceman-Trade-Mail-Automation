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
    21170: "https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/ee0dcf02-6a37-ed9e-d75b-709a27823d99.png",
    21175: "https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/33a3bed5-c943-9c0b-caae-8227778e6889.png",
    21181: "https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/dd429c80-ee5d-5240-491e-fa5084b94154.png",
    21187: "https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/2848da88-cb23-cd4b-a3b6-7fd980019c7f.png",
    21171: "https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/a8fc35d6-15f5-3bfc-07ff-ada88dd130a6.png",
    21176: "https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/272967a3-495c-2b18-a8a0-4796dfbd3446.png",
    21178: "https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/dfd2e38e-4a82-0c8a-19ac-e3aab4254468.png",
    21188: "https://mcusercontent.com/dd5cd43b1cf512f035a1166fc/images/0b35f388-1910-3cc3-2465-48b9d629b770.png",
};

function getUrlPorId(id: string): string{
    return NAMES[id] || "https://fastly.picsum.photos/id/826/200/400.jpg?hmac=VvENoX-lY-uCXQ0bbTUOiRj3g7hlI1hxVek3LQ-htuA";
}
