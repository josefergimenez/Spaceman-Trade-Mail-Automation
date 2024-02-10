import './App.css';
import AlertCard from './components/AlertCard';
import DispersionImage from './components/DispersionImage';
import StackedBarsChart from './components/StackedBarsChart';
import TableType1 from './components/TableType1';
import TableType2 from './components/TableType2';
import { Beer, BeerDispersion, Cluster, ClusterWithProducts } from './types';

const data: Beer = {
    id: 'hola',
    percentage: 90.2,
    pp: 0.0,
    }

const data2: Cluster = {
    name: 'VARI',
    percentageOne: 100,
    percentageTwo: 90,
    pp: 2.2
    }

const data3: ClusterWithProducts = {
    zone: [{
        name: "Centro Mbarete",
        product: [{
        name: "string",
        percentageOne: 92.2,
        percentageTwo: 82.2,
        pp: 1.2
        }]}]}

const data4: BeerDispersion = {
   id: "123",
   price: "2.300"
}

export default function App() {
  return (
    <div className="">
     <AlertCard
        beers={[data,data,data]}
        zone="CDE"
     /> 
     <TableType1 
        title="VARIACION MTD DE LAS TRILITRO"
        zone="METRO"
        fromDate='18-ENE'
        toDate='22-ENE'
        clusters={[data2,data2,data2]}
        />
     <TableType2
     title="Metro"
     fromDate='18-ENE'
     toDate='22-ENE'
     data={data3}
     />
     <DispersionImage
        zone="PTC"
        beers={[data4,data4,data4,data4,data4,data4,data4,data4,]}        
     />
     <StackedBarsChart
        zone="TEST"
        product='TEST'
        labels={["HOLA", "QUE TAL"]}
        data="mock"

     />
     </div>

  )
} 
