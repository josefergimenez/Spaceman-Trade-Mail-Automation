import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

interface DataItem {
  precioskusinpromo: number;
  cantidad: string;
  periodo: number;
}

interface TransformedDataItem {
  name: string;
  [key: string]: any; // Para permitir propiedades dinámicas
}

interface StackedBarsChartProps {
  zone: string;
  product: string;
  labels: string[];
  data: TransformedDataItem[];
}

const transformData = (originalData: DataItem[]): TransformedDataItem[] => {
  const totalPorPeriodo: { [key: string]: number } = {};
  originalData.forEach(item => {
    const periodoKey = item.periodo.toString();
    const cantidad = parseInt(item.cantidad, 10);
    if (!totalPorPeriodo[periodoKey]) {
      totalPorPeriodo[periodoKey] = 0;
    }
    totalPorPeriodo[periodoKey] += cantidad;
  });

  const dataByPeriodo: { [key: string]: TransformedDataItem } = {};

  originalData.forEach(item => {
    const periodoKey = item.periodo.toString();
    const porcentaje = parseFloat((parseInt(item.cantidad, 10) / totalPorPeriodo[periodoKey] * 100).toFixed(1));
    const priceKey = `${item.precioskusinpromo}`;

    if (!dataByPeriodo[periodoKey]) {
      dataByPeriodo[periodoKey] = { name: periodoKey };
    }

    dataByPeriodo[periodoKey][priceKey] = porcentaje;
  });

  return Object.values(dataByPeriodo);
};

const NAMES: Record<string, string> = {
  21170: "01- PILSEN 940 BOTELLA RETORNABLE",
  21175: "02- BRAHMA 940 BOTELLA RETORNABLE",
  21181: "03- OURO FINO 940 BOTELLA RETORNABLE",
  21187: "04- SKOL LITRO",
  21171: "01- PILSEN EXTRA 269 LATA",
  21176: "02- BRAHMA SZ 269 LATA",
  21178: "03- OURO FINO 269 LATA",
  21188: "05- BUD 66 269 LATA",

}
const StackedBarsChart: React.FC<StackedBarsChartProps> = ({
  zone,
  product,
  labels,
  data,
}) => {

  const colors = ["#11239D", "#E56C37", "#C8A001", "#9171CD", "#148CFE", "#BF5CCA", "#6B007A", "#EC7677", "#5EAE9E", "#D32F2F", "#FFC107", "#009688"];

  //@ts-ignore
  const dataTransformada = transformData(data);

  const keys = Array.from(new Set(dataTransformada.flatMap(item => Object.keys(item).filter(key => key !== 'name'))));

  return (
    <div className='mt-5 w-[600px] border'>
      <div className="flex justify-between w-full">
        <p className='bg-primary text-white p-2 rounded'>{NAMES[product]}</p>
        <p className='bg-primary text-white p-2 rounded'>{zone.toUpperCase()}</p>
      </div>
      <p className='mt-2 bg-primary text-white text-center'>A QUE PRECIO VENDEN LOS PDV?</p>
      <BarChart width={600} height={500} data={dataTransformada}>
        <XAxis dataKey="name" />
        <Legend />
        {keys.map((key, index) => (
          <Bar dataKey={key} stackId="a" fill={colors[index % colors.length]}>
            <LabelList dataKey={key} position="inside" formatter={(value: number) => `${value}%`} style={{ fill: 'white' }} />
          </Bar>
        ))}
      </BarChart>
    </div>
  );
};

export default StackedBarsChart
