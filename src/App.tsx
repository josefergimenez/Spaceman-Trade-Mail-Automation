import cluster from 'cluster';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { useEffect, useState, Fragment, useRef } from 'react';
import './App.css';
import AlertCard from './components/AlertCard';
import DispersionImage from './components/DispersionImage';
import StackedBarsChart from './components/StackedBarsChart';
import TableType1 from './components/TableType1';
import TableType2 from './components/TableType2';
import { BeerDispersion, ClusterWithProducts } from './types';
import FormDate from './components/FormDate';


const data4: BeerDispersion[] = [{
   id: "123",
   price: "3.333"
},{
   id: "123",
   price: "3.500"
},{
   id: "123",
   price: "5.500"
},{
   id: "123",
   price: "2.500"
},{
   id: "123",
   price: "7.000"
},{
   id: "123",
   price: "9.000"
},{
   id: "123",
   price: "8.000"
},{
   id: "123",
   price: "7.500"
},]

const calculateAverages = (table:any) => {
  Object.keys(table).forEach(groupKey => {
    table[groupKey].forEach((item: any) => {
    item.respeteActualAvg = item.respeteActualSum / item.count;
    item.respeteAnteriorAvg = item.respeteAnteriorSum / item.count;
    item.pp = (item.ppSum / item.count).toFixed(1)
    item.percentageOne = (item.percentageOneSum / item.count).toFixed(1)
    item.percentageTwo = (item.percentageTwoSum / item.count).toFixed(1)

      delete item.respeteActualSum;
      delete item.respeteAnteriorSum;
      delete item.ppSum;
      delete item.percentageOneSum;
      delete item.percentageTwoSum;
      delete item.count;
    });
  });
};

const METRO = ["SALA BODEGAS", "CENTRO MBARETE", "GRAN ASU"]
export default function App() {
    
    const [isFormActive, setIsFormActive] = useState(true);
    const [clientSQL, setClientSQL] = useState('Cargando');
    const [e, setE] = useState('error')
    const [startDate1, setStartDate1] = useState<Date | null>(null);
    const [endDate1, setEndDate1] = useState<Date | null>(null);
    const [startDate2, setStartDate2] = useState<Date | null>(null);
    const [endDate2, setEndDate2] = useState<Date | null>(null);
    const isFormActivePrevious = useRef<boolean>(isFormActive);

      useEffect(() => {
        if (isFormActivePrevious.current && !isFormActive) {
          const testConnection = async () => {
            try {
              const response = await window.electronAPI.getData(startDate1, endDate1, startDate2, endDate2);
              setClientSQL(JSON.stringify(response));
            } catch (error: any) {
              console.error("Error al conectar con la base de datos", error);
              setClientSQL(error.message);
            }
          };

          testConnection();
        }

        isFormActivePrevious.current = isFormActive;
      }, [isFormActive]);
    
    if (isFormActive){
        return <div className='flex justify-center items-center h-screen'>
        <FormDate
          startDate1={startDate1}
          setStartDate1={setStartDate1}
          endDate1={endDate1}
          setEndDate1={setEndDate1}
          startDate2={startDate2}
          setStartDate2={setStartDate2}
          endDate2={endDate2}
          setEndDate2={setEndDate2}
          setIsFormActive={setIsFormActive}
        />
      </div>
 

    }


    const saveImage = () => {
      const node = document.getElementById('main'); 
    
        if (!node) {return}

      htmlToImage.toPng(node)
        .then((dataUrl) => {
          const img = new Image();
          img.src = dataUrl;
          saveAs(dataUrl, 'output.png');
        })
        .catch((error) => {
          setE(error)
          console.error('Error:', error);
        });
    };


    //useEffect(() => {
    //    const testConnection = async () => {
    //        try {
    //            const response = await window.electronAPI.getData()
    //            setClientSQL(JSON.stringify(response));
    //        } catch (error: any) {
    //            console.error("Error al conectar con la base de datos", error);
    //            setClientSQL(error.message);
    //        } 
    //    };

     //   testConnection();
    //}, []); 

    if (clientSQL === 'Cargando') {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          </div>

        <div className="mt-3">Cargando...</div>
      </div>
    );
    }

    //return <div>{JSON.stringify(clientSQL)}</div>
    const dataObject = JSON.parse(clientSQL)
      if (!Array.isArray(dataObject)) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="bg-orange-500 text-white p-4 rounded-lg text-2xl">
              Por favor, compruebe su conexión a la base de datos.
            </div>
          </div>
        );
      }
        

    //PARTE 1
    const botellaAlert1: any = {}
    const lataAlert: any = {}
    //PARTE 2
    const botellasTable1: any = {
        METRO: {},
        INTERIOR: {}
        }
    //PARTE 3
    const table2Latas: any = {
        METRO: [],
        INTERIOR: []}
    const table2Botellas: any = {
        METRO: [],
        INTERIOR: []}

    interface ProductItem {
      name: string;
      zona: string;
    }

    interface ZoneProductData {
      producto: ProductItem[];
    }

    interface ZoneData {
      [key: string]: ZoneProductData; 
    }

    interface OrganizedData {
      METRO: ZoneData;
      INTERIOR: ZoneData;
    }

    const organizedData: OrganizedData = {
      METRO: {},
      INTERIOR: {}
    };

    const organizedData1: OrganizedData = {
      METRO: {},
      INTERIOR: {}
    };

    dataObject.forEach((producto: any) => {
        if('lata' in producto) {
            //PARTE 1 LATA
            if (producto.respeteActual && producto.respeteActual < 0.85) {
                if (!lataAlert[producto.zona]) {
                    lataAlert[producto.zona] = [];
                    }

                const changePercentage = (producto.respeteAnterior != null) ? 
                ((producto.respeteActual - producto.respeteAnterior) * 100).toFixed(1) 
                : "N/A";
                    
                const alertObject = {
                    'id': producto.lata,
                    'percentage': (producto.respeteActual * 100).toFixed(1),
                    'pp': changePercentage,
                };

                lataAlert[producto.zona].push(alertObject);}

        } else {
            //PARTE 1 BOTELLA
            if (producto.respeteActual && producto.respeteActual < 0.85) {
                if (!botellaAlert1[producto.zona]) {
                    botellaAlert1[producto.zona] = [];
                    }

                const changePercentage = (producto.respeteAnterior != null) ? 
                ((producto.respeteActual - producto.respeteAnterior) * 100).toFixed(1) 
                : "N/A";
                    
                const alertObject = {
                    'id': producto.botella,
                    'percentage': (producto.respeteActual * 100).toFixed(1),
                    'pp': changePercentage,
                };

                botellaAlert1[producto.zona].push(alertObject);}

            //PARTE 2A BOTELLA 
            if([21175, 21170, 21181].includes(producto.botella)){
                if (METRO.includes(producto.zona)){
                    if(!botellasTable1.METRO[producto.zona]){
                        botellasTable1.METRO[producto.zona] = {
                            'respeteActual': producto.respeteActual/3,
                            'respeteAnterior': producto.respeteAnterior/3
                            }
                    } else {
                        botellasTable1.METRO[producto.zona].respeteActual += producto.respeteActual/3
                        botellasTable1.METRO[producto.zona].respeteAnterior += producto.respeteAnterior/3
                        }
                } else {
                    if(!botellasTable1.INTERIOR[producto.zona]){
                        botellasTable1.INTERIOR[producto.zona] = {
                            'respeteActual': producto.respeteActual/3,
                            'respeteAnterior': producto.respeteAnterior/3
                            }
                    } else {
                        botellasTable1.INTERIOR[producto.zona].respeteActual += producto.respeteActual/3
                        botellasTable1.INTERIOR[producto.zona].respeteAnterior += producto.respeteAnterior/3
                        }
                    }
            }
            }})



    //PARTE 2B
    const METROArray = Object.keys(botellasTable1.METRO).map((key) => ({
      name: key,
      ...botellasTable1.METRO[key],
    }));
    const INTERIORArray = Object.keys(botellasTable1.INTERIOR).map((key) => ({
      name: key,
      ...botellasTable1.INTERIOR[key],
    }));
 
    METROArray.forEach((item)=>{
        item.percentageOne = (item.respeteAnterior * 100).toFixed(1)
        item.percentageTwo = (item.respeteActual * 100).toFixed(1)
        item.pp = ((item.percentageTwo-item.percentageOne)*100).toFixed(1)
        })
    INTERIORArray.forEach((item)=>{
        item.percentageOne = (item.respeteAnterior * 100).toFixed(1)
        item.percentageTwo = (item.respeteActual * 100).toFixed(1)
        item.pp = ((item.percentageTwo-item.percentageOne)*100).toFixed(1)
        })

    //PARTE 3
     dataObject.forEach((item: any)=>{
        item.percentageOne = (item.respeteAnterior * 100).toFixed(1)
        item.percentageTwo = (item.respeteActual * 100).toFixed(1)
        item.pp = ((item.percentageTwo-item.percentageOne)*100).toFixed(1)
        })

    // return <div>{JSON.stringify(dataObject)}</div>
    dataObject.forEach((item: any) => {
      const container = item.name.includes("LATA") ? table2Latas : table2Botellas;
      
      const key = METRO.includes(item.zona) ? "METRO" : "INTERIOR";
      
      // Buscar el objeto en el array correspondiente por nombre, si existe
      let groupItem = container[key].find((x: any) => x.name === item.name);

      if (!groupItem) {
        groupItem = {
          name: item.name,
          count: 0,
          respeteActualSum: 0,
          respeteAnteriorSum: 0,
          ppSum: 0,
          percentageOneSum: 0,
          percentageTwoSum: 0
        };
        container[key].push(groupItem);
      }

      groupItem.respeteActualSum += item.respeteActual || 0;
      groupItem.respeteAnteriorSum += item.respeteAnterior || 0;
      groupItem.ppSum += parseFloat(item.pp) || 0;
      groupItem.percentageOneSum += parseFloat(item.percentageOne) || 0;
      groupItem.percentageTwoSum += parseFloat(item.percentageTwo) || 0;
      groupItem.count += 1;})

    calculateAverages(table2Botellas)
    calculateAverages(table2Latas)

    //PARTE 3
    dataObject.forEach((item: ProductItem) => {
      const category = METRO.includes(item.zona) ? "METRO" : "INTERIOR";

      // Asegúrate de que la zona exista en la categoría correspondiente


      // Clasificar el item como Lata o Botella
      // Aquí necesitas definir cómo determinar si un item es Lata o Botella
      const itemType = item.name.includes("LATA") ? "Lata" : "Botella";

      // Agrega el item al array correspondiente dentro de la zona
      if (itemType == 'Lata'){
          if (!organizedData[category][item.zona]) {
            organizedData[category][item.zona] = { producto: [] };
          }
        organizedData[category][item.zona]['producto'].push(item);
      } else {
          if (!organizedData1[category][item.zona]) {
            organizedData1[category][item.zona] = { producto: [] };
          }
        organizedData1[category][item.zona]['producto'].push(item);
          }
    });

    const transformToClusterWithProducts = (originalData: any): ClusterWithProducts => {
        const zones = Object.keys(originalData).map(zoneName => ({
            name: zoneName,
            product: originalData[zoneName].producto.map((prod: any) => ({
                name: prod.name,
                percentageOne: parseFloat(prod.percentageOne) || 0, 
                percentageTwo: parseFloat(prod.percentageTwo) || 0,
                pp: parseFloat(prod.pp) || 0, 
            })),
        }));

        return { zone: zones as [{ name: string; product: [{ name: string; percentageOne: number; percentageTwo: number; pp: number; }]; }] };
    };

    const clusterWithProducts1 = transformToClusterWithProducts(organizedData1.METRO);
    const clusterWithProducts2 = transformToClusterWithProducts(organizedData1.INTERIOR);

    const clusterWithProducts3 = transformToClusterWithProducts(organizedData.METRO);
    const clusterWithProducts4 = transformToClusterWithProducts(organizedData.INTERIOR);
    try {
    return (
    <div>  
    <div id="main" className="w-[600px] justify-items-center grid bg-white">
        <Fragment>
          {Object.keys(lataAlert).map((key) => (
            <AlertCard
              beers={lataAlert[key]}
              zone={key}
            />
          ))}
        </Fragment>
        <Fragment>
          {Object.keys(botellaAlert1).map((key) => (
            <AlertCard
                beers={botellaAlert1[key]}
              zone={key}
            />
          ))}
        </Fragment>
    
    <p className='text-[#082a39] mt-8'>
    En los cuadros de abajo podemos ver en detalle lo alertado anteriormente</p>
    <TableType1 
    title="VARIACION MTD DE LAS TRILITRO"
    zone="METRO"
    fromDate={getLastBusinessDayExcludingSundays()}
    toDate={getTodayFormatted()}
    clusters={METROArray}
    />
    <TableType1 
    title="VARIACION MTD DE LAS TRILITRO"
    zone="INTERIOR"
    fromDate={getLastBusinessDayExcludingSundays()}
    toDate={getTodayFormatted()}
    clusters={INTERIORArray}
    />
    <TableType1 
    title="Promedio Respete"
    zone="METRO"
    fromDate={getLastBusinessDayExcludingSundays()}
    toDate={getTodayFormatted()}
    clusters={table2Botellas.METRO}
    />
    <TableType1 
    title="Promedio Respete"
    zone="INTERIOR"
    fromDate={getLastBusinessDayExcludingSundays()}
    toDate={getTodayFormatted()}
    clusters={table2Botellas.INTERIOR}
    />
    <TableType2
     title="METRO"
     fromDate={getLastBusinessDayExcludingSundays()}
     toDate={getTodayFormatted()}
     data={clusterWithProducts1}
     />
     <TableType2
     title="INTERIOR"
     fromDate={getLastBusinessDayExcludingSundays()}
     toDate={getTodayFormatted()}
     data={clusterWithProducts2}
     />   
    <p className="mt-5 w-2/5 text-center items-center justify-center flex text-2xl font-bold text-primary">PROMEDIO RESPETE VS MES ANTERIOR</p>
    <TableType1 
    title="Promedio Respete"
    zone="METRO"
    fromDate={getPreviousMonthFormatted()}
    toDate={getCurrentMonthFormatted()}
    clusters={table2Latas.METRO}
    />
    <TableType1 
    title="Promedio Respete"
    zone="INTERIOR"
    fromDate={getPreviousMonthFormatted()}
    toDate={getCurrentMonthFormatted()}
    clusters={table2Latas.INTERIOR}
    />
    <TableType2
     title="METRO"
     fromDate={getPreviousMonthFormatted()}
     toDate={getCurrentMonthFormatted()}
     data={clusterWithProducts3}
     />
     <TableType2
     title="INTERIOR"
     fromDate={getPreviousMonthFormatted()}
     toDate={getCurrentMonthFormatted()}
     data={clusterWithProducts4}
     />   
    <p className="mt-8 w-2/5 text-center items-center justify-center flex text-2xl font-bold text-primary">DISPERSIÓN</p>
    <p className='text-[#082a39] mt-1'>
    Dispersión de precios físicos por región.</p>

     <DispersionImage
        zone="PTC"
        beers={data4}        
     />

        <Fragment>
        {
          dataObject.map((item: any, index: any) => (
                item.respeteActual < 0.85 && item.respeteActual > 0 ? (
                  <StackedBarsChart
                    zone={item.zona}
                    product={item.botella || item.lata}
                    labels={[]}
                    data={item.dispersion}
                 />
            ) : null
          ))
        }
      </Fragment>


     </div>
     <div className='flex w-[600px] justify-center'>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-6"
                onClick={saveImage}>
            Guardar Imagen
    </button>
</div>
</div>

)}

catch {
    return (
          <div className="flex justify-center items-center h-screen">
            <div className="bg-orange-500 text-white p-4 rounded-lg text-2xl">
              Por favor, compruebe los datos esperados 
            </div>

          </div>

    )
    }
}

function getLastBusinessDayExcludingSundays() {
const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
let count = 1; // Comenzar contando desde ayer
let businessDaysFound = 0;

  while (true) { // Bucle infinito, saldremos explícitamente
    const date = new Date();
    date.setDate(date.getDate() - count);

    if (date.getDay() !== 0) { // El día de la semana para domingo es 0
      businessDaysFound++;
      if (businessDaysFound === 3) {
        const formattedDate = `${date.getDate()}-${months[date.getMonth()]}`;
        return formattedDate; // Devolver la fecha formateada
      }
    }
    count++; // Prepararse para revisar el día anterior en la próxima iteración
  }
}

function getTodayFormatted() {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const today = new Date();
  const formattedToday = `${today.getDate()}-${months[today.getMonth()]}`;

  return formattedToday;
}

function getCurrentMonthFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  return `${year}/${month}`;
}

function getPreviousMonthFormatted() {
  const today = new Date();
  today.setMonth(today.getMonth() - 1); // Restar un mes
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  return `${year}/${month}`;
}
