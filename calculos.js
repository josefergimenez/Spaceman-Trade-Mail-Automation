
const BOTELLAS = [21170, 21175, 21181, 21187]
const LATAS = [21176, 21171, 21178, 21188]
const NAMES = {
    21170: "01- PILSEN 940 BOTELLA RETORNABLE",
    21175: "02- BRAHMA 940 BOTELLA RETORNABLE",
    21181: "03- OURO FINO 940 BOTELLA RETORNABLE",
    21187: "04- SKOL LITRO",
    21171: "01- PILSEN EXTRA 269 LATA",
    21176: "02- BRAHMA SZ 269 LATA",
    21178: "03- OURO FINO 269 LATA",
    21188: "05- BUD 66 269 LATA",

}
const TABLE = '"public"."tabla_prueba"'
const ZONAS = [
    {value: 110, label: "CENTRO MBARETE"},
    {value: 13, label: "GRAN ASU"},
    {value: 8, label: "OVIEDO"},
    {value: 6, label: "CDE"},
    {value: 4, label: "ENCARNACION"},
    {value: 115, label: "SALA BODEGAS"},
    {value: 117, label: "SANTANI"},
    {value: 9, label: "VILLARICA"},
    {value: 2, label: "SAN ALBERTO"},
    {value: 11, label: "SANTA RITA"},
    {value: 14, label: "CAAGUAZU"},
]

async function main(dbClient) {
    //return MOCKDATA
    const response = [];
    
    //CONDICION WHERE PARA LA BUSQUEDA EN LA DB
    const periodQuery = getSqlPeriodClause()
    const periodPrevQuery = getPreviousPeriodClause()

    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const periodo = '202211'//`'${year}${month}'`;

    const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1); // Resta 1 mes para obtener el mes anterior
    const yearPrev = previousMonthDate.getFullYear();
    const monthPrev = ('0' + (previousMonthDate.getMonth() + 1)).slice(-2); // Asegura el formato de dos dígitos
    const periodoAnterior= '202211'//`'${yearPrev}${monthPrev}'`;

    let dataPart1Botellas = [];
    let dataPart1Latas = [];
    let query = ''


    query = `SELECT
              id4 AS zona,
              idlineaproducto AS botella,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND tienedisponible <> 'NO VENDE' AND ${periodQuery} THEN 1 ELSE 0 END) AS total_respeto_actual,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND tienedisponible <> 'NO VENDE' AND ${periodPrevQuery} THEN 1 ELSE 0 END) AS total_respeto_anterior,
              SUM(CASE WHEN tienedisponible <> 'NO VENDE' AND ${periodQuery} THEN 1 ELSE 0 END) AS total_disponible_actual,
              SUM(CASE WHEN tienedisponible <> 'NO VENDE' AND ${periodPrevQuery} THEN 1 ELSE 0 END) AS total_disponible_anterior,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND ${periodQuery} THEN volpromediomensual ELSE 0 END) AS total_respeta_volumen_actual,
              SUM(CASE WHEN respetanorespeta = 'NO RESPETA' AND ${periodQuery} THEN volpromediomensual ELSE 0 END) AS total_no_respeta_volumen_actual,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND ${periodPrevQuery} THEN volpromediomensual ELSE 0 END) AS total_respeta_volumen_anterior,
              SUM(CASE WHEN respetanorespeta = 'NO RESPETA' AND ${periodPrevQuery} THEN volpromediomensual ELSE 0 END) AS total_no_respeta_volumen_anterior
            FROM
              ${TABLE}
            WHERE
              (${periodQuery} OR ${periodPrevQuery})
            GROUP BY
              id4,
              idlineaproducto;`
        
        let resultadosAgrupados = await dbClient.query(query);
        for (let resultado of resultadosAgrupados) {
            let valRespPromActual = respetePromediado(
                resultado.total_no_respeta_volumen_actual,
                resultado.total_respeta_volumen_actual,
                resultado.total_disponible_actual,
                resultado.total_respeto_actual
            );

            let valRespPromAnterior = respetePromediado(
                resultado.total_no_respeta_volumen_anterior,
                resultado.total_respeta_volumen_anterior,
                resultado.total_disponible_anterior,
                resultado.total_respeto_anterior
            );

            let zonaLabel = obtenerZonaLabelPorId(resultado.zona);

            let botellaNombre = NAMES[resultado.botella];
    
            if (botellaNombre && !botellaNombre.includes("LATA")) { 
                response.push({
                    name: botellaNombre,
                    zona: zonaLabel,
                    botella: Number(resultado.botella),
                    respeteActual: valRespPromActual,
                    respeteAnterior: valRespPromAnterior,
                    dispersion: [] 
                });
            }

    }

    query = `SELECT
              id4 AS zona,
              idlineaproducto AS lata,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND tienedisponible <> 'NO VENDE' AND periodo = '${periodo}' THEN 1 ELSE 0 END) AS total_respeto_actual,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND tienedisponible <> 'NO VENDE' AND periodo = '${periodoAnterior}' THEN 1 ELSE 0 END) AS total_respeto_anterior,
              SUM(CASE WHEN tienedisponible <> 'NO VENDE' AND periodo = '${periodo}' THEN 1 ELSE 0 END) AS total_disponible_actual,
              SUM(CASE WHEN tienedisponible <> 'NO VENDE' AND periodo = '${periodoAnterior}' THEN 1 ELSE 0 END) AS total_disponible_anterior,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND periodo = '${periodo}' THEN volpromediomensual ELSE 0 END) AS total_respeta_volumen_actual,
              SUM(CASE WHEN respetanorespeta = 'NO RESPETA' AND periodo = '${periodo}' THEN volpromediomensual ELSE 0 END) AS total_no_respeta_volumen_actual,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND periodo = '${periodoAnterior}' THEN volpromediomensual ELSE 0 END) AS total_respeta_volumen_anterior,
              SUM(CASE WHEN respetanorespeta = 'NO RESPETA' AND periodo = '${periodoAnterior}' THEN volpromediomensual ELSE 0 END) AS total_no_respeta_volumen_anterior
            FROM
              ${TABLE}
            WHERE
              (periodo = '${periodo}' OR periodo = '${periodoAnterior}')
            GROUP BY
              id4,
              idlineaproducto;`
        
        let resultadosAgrupadosLata = await dbClient.query(query);
        for (let resultado of resultadosAgrupadosLata) {
            let valRespPromActual = respetePromediado(
                resultado.total_no_respeta_volumen_actual,
                resultado.total_respeta_volumen_actual,
                resultado.total_disponible_actual,
                resultado.total_respeto_actual
            );

            let valRespPromAnterior = respetePromediado(
                resultado.total_no_respeta_volumen_anterior,
                resultado.total_respeta_volumen_anterior,
                resultado.total_disponible_anterior,
                resultado.total_respeto_anterior
            );

            let zonaLabel = obtenerZonaLabelPorId(resultado.zona);

            let lataNombre = NAMES[resultado.lata];
    
            if (lataNombre && lataNombre.includes("LATA")) { 
                response.push({
                    name: lataNombre,
                    zona: zonaLabel,
                    lata: Number(resultado.lata),
                    respeteActual: valRespPromActual,
                    respeteAnterior: valRespPromAnterior,
                    dispersion: [] 
                });
            }

    }

    query = `
        SELECT idlineaproducto, id4, precioskusinpromo, COUNT(*) AS cantidad, periodo
        FROM ${TABLE}
        WHERE precioskusinpromo IS NOT NULL 
        AND ${getSqlDateRangeForCurrentAndPreviousMonths(5)} 
        AND (idlineaproducto IN (${[...BOTELLAS, ...LATAS].join(", ")}))
        GROUP BY idlineaproducto, id4, periodo, precioskusinpromo
        ORDER BY periodo DESC, COUNT(*) DESC;
    `;
    let resultadosDispersión = await dbClient.query(query);
    for (let resultado of resultadosDispersión) {
        let zonaLabel = obtenerZonaLabelPorId(resultado.id4);
        let productoID = resultado.idlineaproducto;

    let objetoCorrespondiente = response.find(obj => 
        obj.zona === zonaLabel &&
        (Number(obj.botella) === Number(productoID) || Number(obj.lata) === Number(productoID))
    );
        if (objetoCorrespondiente) {
            objetoCorrespondiente.dispersion.push({
                precioskusinpromo: resultado.precioskusinpromo,
                cantidad: resultado.cantidad,
                periodo: resultado.periodo
            });
        }
    }
        

        for (const zona of ZONAS) {
        for (const botella of BOTELLAS) {
           

            query = `
                SELECT precioskusinpromo, COUNT(*) AS cantidad, periodo
                FROM ${TABLE}
                WHERE precioskusinpromo IS NOT NULL 
                AND ${getSqlDateRangeForCurrentAndPreviousMonths(5)} 
                AND idlineaproducto = ${botella}
                AND id4 = '${zona.value}'
                GROUP BY periodo, precioskusinpromo
                ORDER BY periodo DESC, COUNT(*) DESC;`

        }
        for (const lata of LATAS) {

            query = `
                SELECT precioskusinpromo, COUNT(*) AS cantidad, periodo
                FROM ${TABLE}
                WHERE precioskusinpromo IS NOT NULL 
                AND ${getSqlDateRangeForCurrentAndPreviousMonths(5)} 
                AND idlineaproducto = ${lata}
                AND id4 = '${zona.value}'
                GROUP BY periodo, precioskusinpromo
                ORDER BY periodo DESC, COUNT(*) DESC;`
            
        }
    }
    console.log(response[0].dispersion)
    return response

}

function respetePromediado(volumenNoRespeta, volumenRespeta, skuDisponible, skuRespete) {
    try {
        const respetePonderado = volumenRespeta/(volumenRespeta + volumenNoRespeta)
        const respeteFisico = skuRespete/skuDisponible
        const respete = (respeteFisico+respetePonderado)/2
        if (typeof(respete) == 'number') {
            return respete    
        } 
        return NaN

    } catch {return NaN}
    
}

const getSqlPeriodClause = (day) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); 

  let daysToSubtract;
  let whereClause = '';

  if (dayOfWeek === 1 || day == 'lunes') { // Lunes
    // Jueves = 4, Viernes = 5, Sábado = 6, Domingo = 0
    daysToSubtract = [3, 2, 1, 0].map(day => new Date(today.setDate(today.getDate() - day)).toISOString().split('T')[0]);
    whereClause = `(fechayhoradelaencuesta BETWEEN '${daysToSubtract[3]}' AND '${daysToSubtract[0]}')`;
  } else if (dayOfWeek === 4 || day == 'jueves') { // Jueves
    // Lunes = 1, Martes = 2, Miércoles = 3
    daysToSubtract = [2, 1, 0].map(day => new Date(today.setDate(today.getDate() - day)).toISOString().split('T')[0]);
    whereClause = `(fechayhoradelaencuesta BETWEEN '${daysToSubtract[2]}' AND '${daysToSubtract[0]}')`;
  }
  return "(fechayhoradelaencuesta BETWEEN '2022-11-01' AND '2022-11-30')"
  return whereClause;
};

const getPreviousPeriodClause = (day) => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  let startDate, endDate;
  let whereClause = '';

  if (dayOfWeek === 1 || day === 'lunes') { 
    startDate = new Date(today);
    startDate.setDate(today.getDate() - (today.getDay() + 6));
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2); 
  } else if (dayOfWeek === 4 || day === 'jueves') {
    startDate = new Date(today);
    startDate.setDate(today.getDate() - (today.getDay() - 1));
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2); 
  }

  if (startDate && endDate) {
    whereClause = `(fechayhoradelaencuesta BETWEEN '${startDate.toISOString().split('T')[0]}' AND '${endDate.toISOString().split('T')[0]}')`;
  }
  return "(fechayhoradelaencuesta BETWEEN '2022-11-01' AND '2022-11-30')"
  return whereClause;
};

function getSqlDateRangeForCurrentAndPreviousMonths(periodsBack = 5) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let adjustedYear = currentYear;
    let adjustedMonth = currentMonth - periodsBack;
    while (adjustedMonth < 0) {
        adjustedYear -= 1;
        adjustedMonth += 12;
    }

    const startPeriodDate = new Date(adjustedYear, adjustedMonth, 1);
    const startYear = startPeriodDate.getFullYear();
    const startMonth = ('0' + (startPeriodDate.getMonth() + 1)).slice(-2);
    const startDate = `${startYear}-${startMonth}-01`;

    const endPeriodDate = new Date(currentYear, currentMonth + 1, 0); 
    const endYear = endPeriodDate.getFullYear();
    const endMonth = ('0' + (endPeriodDate.getMonth() + 1)).slice(-2); 
    const endDay = ('0' + endPeriodDate.getDate()).slice(-2);
    const endDate = `${endYear}-${endMonth}-${endDay}`;

    return "(fechayhoradelaencuesta BETWEEN '2022-11-01' AND '2022-11-30')"
    return `(fechayhoradelaencuesta BETWEEN '${startDate}' AND '${endDate}')`;
}

function obtenerZonaLabelPorId(zonaId) {
    const zona = ZONAS.find(z => z.value === zonaId);
    return zona ? zona.label : "Zona Desconocida";
}

module.exports = { main }

const MOCKDATA = [{"name":"01- PILSEN 940 BOTELLA RETORNABLE","zona":"CENTRO MBARETE","botella":21170,"respeteActual":0.8935193519351936,"respeteAnterior":0.8935193519351936,"dispersion":[{"precioskusinpromo":7500,"cantidad":"138","periodo":202211},{"precioskusinpromo":7000,"cantidad":"30","periodo":202211},{"precioskusinpromo":8000,"cantidad":"12","periodo":202211},{"precioskusinpromo":6500,"cantidad":"2","periodo":202211}]},{"name":"02- BRAHMA 940 BOTELLA RETORNABLE","zona":"CENTRO MBARETE","botella":21175,"respeteActual":0.8139930660235152,"respeteAnterior":0.8139930660235152,"dispersion":[{"precioskusinpromo":7000,"cantidad":"145","periodo":202211},{"precioskusinpromo":7500,"cantidad":"29","periodo":202211},{"precioskusinpromo":6500,"cantidad":"14","periodo":202211},{"precioskusinpromo":8000,"cantidad":"2","periodo":202211},{"precioskusinpromo":6000,"cantidad":"1","periodo":202211}]},{"name":"03- OURO FINO 940 BOTELLA RETORNABLE","zona":"CENTRO MBARETE","botella":21181,"respeteActual":0.7098723571673111,"respeteAnterior":0.7098723571673111,"dispersion":[{"precioskusinpromo":6000,"cantidad":"119","periodo":202211},{"precioskusinpromo":6500,"cantidad":"18","periodo":202211},{"precioskusinpromo":7000,"cantidad":"13","periodo":202211},{"precioskusinpromo":7500,"cantidad":"1","periodo":202211},{"precioskusinpromo":8000,"cantidad":"1","periodo":202211}]},{"name":"04- SKOL LITRO","zona":"CENTRO MBARETE","botella":21187,"respeteActual":0.8365384615384616,"respeteAnterior":0.8365384615384616,"dispersion":[{"precioskusinpromo":8500,"cantidad":"112","periodo":202211},{"precioskusinpromo":8000,"cantidad":"15","periodo":202211},{"precioskusinpromo":9000,"cantidad":"7","periodo":202211},{"precioskusinpromo":7500,"cantidad":"6","periodo":202211}]},{"name":"02- BRAHMA SZ 269 LATA","zona":"CENTRO MBARETE","lata":21176,"respeteActual":0.5187793427230047,"respeteAnterior":0.5187793427230047,"dispersion":[{"precioskusinpromo":3000,"cantidad":"8","periodo":202211},{"precioskusinpromo":3333,"cantidad":"4","periodo":202211}]},{"name":"01- PILSEN EXTRA 269 LATA","zona":"CENTRO MBARETE","lata":21171,"respeteActual":null,"respeteAnterior":null,"dispersion":[{"precioskusinpromo":3500,"cantidad":"1","periodo":202211}]},{"name":"03- OURO FINO 269 LATA","zona":"CENTRO MBARETE","lata":21178,"respeteActual":0.9025706373752421,"respeteAnterior":0.9025706373752421,"dispersion":[{"precioskusinpromo":3333,"cantidad":"168","periodo":202211},{"precioskusinpromo":3500,"cantidad":"9","periodo":202211},{"precioskusinpromo":3000,"cantidad":"3","periodo":202211},{"precioskusinpromo":3750,"cantidad":"1","periodo":202211},{"precioskusinpromo":4000,"cantidad":"1","periodo":202211}]},{"name":"05- BUD 66 269 LATA","zona":"CENTRO MBARETE","lata":21188,"respeteActual":0.5234741784037559,"respeteAnterior":0.5234741784037559,"dispersion":[{"precioskusinpromo":5000,"cantidad":"10","periodo":202211}]},{"name":"01- PILSEN 940 BOTELLA RETORNABLE","zona":"GRAN ASU","botella":21170,"respeteActual":0.9680166319021362,"respeteAnterior":0.9680166319021362,"dispersion":[{"precioskusinpromo":7500,"cantidad":"224","periodo":202211},{"precioskusinpromo":7000,"cantidad":"7","periodo":202211},{"precioskusinpromo":8000,"cantidad":"3","periodo":202211},{"precioskusinpromo":9000,"cantidad":"2","periodo":202211},{"precioskusinpromo":6500,"cantidad":"1","periodo":202211},{"precioskusinpromo":8500,"cantidad":"1","periodo":202211}]},{"name":"02- BRAHMA 940 BOTELLA RETORNABLE","zona":"GRAN ASU","botella":21175,"respeteActual":0.9424657684985824,"respeteAnterior":0.9424657684985824,"dispersion":[{"precioskusinpromo":7000,"cantidad":"208","periodo":202211},{"precioskusinpromo":6500,"cantidad":"10","periodo":202211},{"precioskusinpromo":7500,"cantidad":"9","periodo":202211},{"precioskusinpromo":6000,"cantidad":"1","periodo":202211},{"precioskusinpromo":8000,"cantidad":"1","periodo":202211},{"precioskusinpromo":9000,"cantidad":"1","periodo":202211}]},{"name":"03- OURO FINO 940 BOTELLA RETORNABLE","zona":"GRAN ASU","botella":21181,"respeteActual":0.9295234970509023,"respeteAnterior":0.9295234970509023,"dispersion":[{"precioskusinpromo":6000,"cantidad":"220","periodo":202211},{"precioskusinpromo":7000,"cantidad":"6","periodo":202211},{"precioskusinpromo":6500,"cantidad":"5","periodo":202211},{"precioskusinpromo":6400,"cantidad":"1","periodo":202211},{"precioskusinpromo":8000,"cantidad":"1","periodo":202211}]},{"name":"04- SKOL LITRO","zona":"GRAN ASU","botella":21187,"respeteActual":0.9529914529914529,"respeteAnterior":0.9529914529914529,"dispersion":[{"precioskusinpromo":8500,"cantidad":"199","periodo":202211},{"precioskusinpromo":8000,"cantidad":"8","periodo":202211},{"precioskusinpromo":9000,"cantidad":"3","periodo":202211},{"precioskusinpromo":7500,"cantidad":"2","periodo":202211},{"precioskusinpromo":10000,"cantidad":"1","periodo":202211}]},{"name":"02- BRAHMA SZ 269 LATA","zona":"GRAN ASU","lata":21176,"respeteActual":0.2768857146620387,"respeteAnterior":0.2768857146620387,"dispersion":[{"precioskusinpromo":3000,"cantidad":"9","periodo":202211},{"precioskusinpromo":3333,"cantidad":"4","periodo":202211}]},{"name":"01- PILSEN EXTRA 269 LATA","zona":"GRAN ASU","lata":21171,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"03- OURO FINO 269 LATA","zona":"GRAN ASU","lata":21178,"respeteActual":0.9585570080925938,"respeteAnterior":0.9585570080925938,"dispersion":[{"precioskusinpromo":3333,"cantidad":"224","periodo":202211},{"precioskusinpromo":3000,"cantidad":"2","periodo":202211},{"precioskusinpromo":3500,"cantidad":"2","periodo":202211},{"precioskusinpromo":4000,"cantidad":"2","periodo":202211},{"precioskusinpromo":5000,"cantidad":"2","periodo":202211},{"precioskusinpromo":3100,"cantidad":"1","periodo":202211}]},{"name":"05- BUD 66 269 LATA","zona":"GRAN ASU","lata":21188,"respeteActual":0.527542372881356,"respeteAnterior":0.527542372881356,"dispersion":[{"precioskusinpromo":5000,"cantidad":"13","periodo":202211}]},{"name":"01- PILSEN 940 BOTELLA RETORNABLE","zona":"OVIEDO","botella":21170,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"02- BRAHMA 940 BOTELLA RETORNABLE","zona":"OVIEDO","botella":21175,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"03- OURO FINO 940 BOTELLA RETORNABLE","zona":"OVIEDO","botella":21181,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"04- SKOL LITRO","zona":"OVIEDO","botella":21187,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"02- BRAHMA SZ 269 LATA","zona":"OVIEDO","lata":21176,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"01- PILSEN EXTRA 269 LATA","zona":"OVIEDO","lata":21171,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"03- OURO FINO 269 LATA","zona":"OVIEDO","lata":21178,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"05- BUD 66 269 LATA","zona":"OVIEDO","lata":21188,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"01- PILSEN 940 BOTELLA RETORNABLE","zona":"CDE","botella":21170,"respeteActual":0.8064851814851814,"respeteAnterior":0.8064851814851814,"dispersion":[{"precioskusinpromo":7500,"cantidad":"84","periodo":202211},{"precioskusinpromo":8000,"cantidad":"17","periodo":202211},{"precioskusinpromo":7000,"cantidad":"1","periodo":202211}]},{"name":"02- BRAHMA 940 BOTELLA RETORNABLE","zona":"CDE","botella":21175,"respeteActual":0.2511893231032111,"respeteAnterior":0.2511893231032111,"dispersion":[{"precioskusinpromo":7500,"cantidad":"84","periodo":202211},{"precioskusinpromo":7000,"cantidad":"33","periodo":202211},{"precioskusinpromo":8000,"cantidad":"20","periodo":202211}]},{"name":"03- OURO FINO 940 BOTELLA RETORNABLE","zona":"CDE","botella":21181,"respeteActual":0.687799952482775,"respeteAnterior":0.687799952482775,"dispersion":[{"precioskusinpromo":6000,"cantidad":"55","periodo":202211},{"precioskusinpromo":7000,"cantidad":"13","periodo":202211},{"precioskusinpromo":6500,"cantidad":"4","periodo":202211},{"precioskusinpromo":7500,"cantidad":"2","periodo":202211},{"precioskusinpromo":8000,"cantidad":"1","periodo":202211}]},{"name":"04- SKOL LITRO","zona":"CDE","botella":21187,"respeteActual":0.9518935929328649,"respeteAnterior":0.9518935929328649,"dispersion":[{"precioskusinpromo":8500,"cantidad":"71","periodo":202211},{"precioskusinpromo":9000,"cantidad":"53","periodo":202211},{"precioskusinpromo":8000,"cantidad":"1","periodo":202211},{"precioskusinpromo":9500,"cantidad":"1","periodo":202211}]},{"name":"02- BRAHMA SZ 269 LATA","zona":"CDE","lata":21176,"respeteActual":0,"respeteAnterior":0,"dispersion":[{"precioskusinpromo":3333,"cantidad":"129","periodo":202211},{"precioskusinpromo":3500,"cantidad":"3","periodo":202211}]},{"name":"01- PILSEN EXTRA 269 LATA","zona":"CDE","lata":21171,"respeteActual":null,"respeteAnterior":null,"dispersion":[{"precioskusinpromo":4500,"cantidad":"4","periodo":202211}]},{"name":"03- OURO FINO 269 LATA","zona":"CDE","lata":21178,"respeteActual":0.28113348407860533,"respeteAnterior":0.28113348407860533,"dispersion":[{"precioskusinpromo":3333,"cantidad":"13","periodo":202211},{"precioskusinpromo":3500,"cantidad":"2","periodo":202211}]},{"name":"05- BUD 66 269 LATA","zona":"CDE","lata":21188,"respeteActual":0.5769230769230769,"respeteAnterior":0.5769230769230769,"dispersion":[{"precioskusinpromo":4500,"cantidad":"21","periodo":202211},{"precioskusinpromo":5000,"cantidad":"1","periodo":202211}]},{"name":"01- PILSEN 940 BOTELLA RETORNABLE","zona":"ENCARNACION","botella":21170,"respeteActual":0.9695121951219512,"respeteAnterior":0.9695121951219512,"dispersion":[{"precioskusinpromo":7500,"cantidad":"152","periodo":202211},{"precioskusinpromo":7000,"cantidad":"2","periodo":202211},{"precioskusinpromo":8000,"cantidad":"1","periodo":202211}]},{"name":"02- BRAHMA 940 BOTELLA RETORNABLE","zona":"ENCARNACION","botella":21175,"respeteActual":0.9584402380470771,"respeteAnterior":0.9584402380470771,"dispersion":[{"precioskusinpromo":7000,"cantidad":"144","periodo":202211},{"precioskusinpromo":7500,"cantidad":"3","periodo":202211},{"precioskusinpromo":6500,"cantidad":"1","periodo":202211}]},{"name":"03- OURO FINO 940 BOTELLA RETORNABLE","zona":"ENCARNACION","botella":21181,"respeteActual":0.7921686746987953,"respeteAnterior":0.7921686746987953,"dispersion":[{"precioskusinpromo":6000,"cantidad":"97","periodo":202211}]},{"name":"04- SKOL LITRO","zona":"ENCARNACION","botella":21187,"respeteActual":0.7993827160493827,"respeteAnterior":0.7993827160493827,"dispersion":[{"precioskusinpromo":8500,"cantidad":"92","periodo":202211},{"precioskusinpromo":8000,"cantidad":"5","periodo":202211}]},{"name":"02- BRAHMA SZ 269 LATA","zona":"ENCARNACION","lata":21176,"respeteActual":0.6697530864197531,"respeteAnterior":0.6697530864197531,"dispersion":[{"precioskusinpromo":3000,"cantidad":"55","periodo":202211},{"precioskusinpromo":3333,"cantidad":"1","periodo":202211}]},{"name":"01- PILSEN EXTRA 269 LATA","zona":"ENCARNACION","lata":21171,"respeteActual":0.5658682634730539,"respeteAnterior":0.5658682634730539,"dispersion":[{"precioskusinpromo":3750,"cantidad":"22","periodo":202211}]},{"name":"03- OURO FINO 269 LATA","zona":"ENCARNACION","lata":21178,"respeteActual":0.5662650602409639,"respeteAnterior":0.5662650602409639,"dispersion":[{"precioskusinpromo":3000,"cantidad":"22","periodo":202211}]},{"name":"05- BUD 66 269 LATA","zona":"ENCARNACION","lata":21188,"respeteActual":0.7055214723926381,"respeteAnterior":0.7055214723926381,"dispersion":[{"precioskusinpromo":4500,"cantidad":"67","periodo":202211}]},{"name":"01- PILSEN 940 BOTELLA RETORNABLE","zona":"SALA BODEGAS","botella":21170,"respeteActual":0.9657000194120312,"respeteAnterior":0.9657000194120312,"dispersion":[{"precioskusinpromo":7500,"cantidad":"132","periodo":202211},{"precioskusinpromo":7000,"cantidad":"6","periodo":202211},{"precioskusinpromo":8000,"cantidad":"2","periodo":202211},{"precioskusinpromo":6500,"cantidad":"1","periodo":202211}]},{"name":"02- BRAHMA 940 BOTELLA RETORNABLE","zona":"SALA BODEGAS","botella":21175,"respeteActual":0.9456076877817731,"respeteAnterior":0.9456076877817731,"dispersion":[{"precioskusinpromo":7000,"cantidad":"133","periodo":202211},{"precioskusinpromo":7500,"cantidad":"7","periodo":202211},{"precioskusinpromo":6500,"cantidad":"2","periodo":202211},{"precioskusinpromo":6000,"cantidad":"1","periodo":202211}]},{"name":"03- OURO FINO 940 BOTELLA RETORNABLE","zona":"SALA BODEGAS","botella":21181,"respeteActual":0.9414003827203421,"respeteAnterior":0.9414003827203421,"dispersion":[{"precioskusinpromo":6000,"cantidad":"124","periodo":202211},{"precioskusinpromo":6500,"cantidad":"2","periodo":202211},{"precioskusinpromo":7000,"cantidad":"1","periodo":202211}]},{"name":"04- SKOL LITRO","zona":"SALA BODEGAS","botella":21187,"respeteActual":0.9655172413793103,"respeteAnterior":0.9655172413793103,"dispersion":[{"precioskusinpromo":8500,"cantidad":"130","periodo":202211},{"precioskusinpromo":8000,"cantidad":"4","periodo":202211},{"precioskusinpromo":9000,"cantidad":"1","periodo":202211}]},{"name":"02- BRAHMA SZ 269 LATA","zona":"SALA BODEGAS","lata":21176,"respeteActual":0.7299270072992701,"respeteAnterior":0.7299270072992701,"dispersion":[{"precioskusinpromo":3000,"cantidad":"63","periodo":202211}]},{"name":"01- PILSEN EXTRA 269 LATA","zona":"SALA BODEGAS","lata":21171,"respeteActual":null,"respeteAnterior":null,"dispersion":[{"precioskusinpromo":3500,"cantidad":"9","periodo":202211}]},{"name":"03- OURO FINO 269 LATA","zona":"SALA BODEGAS","lata":21178,"respeteActual":0.9929577464788732,"respeteAnterior":0.9929577464788732,"dispersion":[{"precioskusinpromo":3333,"cantidad":"138","periodo":202211},{"precioskusinpromo":3000,"cantidad":"2","periodo":202211}]},{"name":"05- BUD 66 269 LATA","zona":"SALA BODEGAS","lata":21188,"respeteActual":0.6729323308270676,"respeteAnterior":0.6729323308270676,"dispersion":[{"precioskusinpromo":5000,"cantidad":"45","periodo":202211},{"precioskusinpromo":3333,"cantidad":"1","periodo":202211}]},{"name":"01- PILSEN 940 BOTELLA RETORNABLE","zona":"SANTANI","botella":21170,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"02- BRAHMA 940 BOTELLA RETORNABLE","zona":"SANTANI","botella":21175,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"03- OURO FINO 940 BOTELLA RETORNABLE","zona":"SANTANI","botella":21181,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"04- SKOL LITRO","zona":"SANTANI","botella":21187,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"02- BRAHMA SZ 269 LATA","zona":"SANTANI","lata":21176,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"01- PILSEN EXTRA 269 LATA","zona":"SANTANI","lata":21171,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"03- OURO FINO 269 LATA","zona":"SANTANI","lata":21178,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"05- BUD 66 269 LATA","zona":"SANTANI","lata":21188,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"01- PILSEN 940 BOTELLA RETORNABLE","zona":"VILLARICA","botella":21170,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"02- BRAHMA 940 BOTELLA RETORNABLE","zona":"VILLARICA","botella":21175,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"03- OURO FINO 940 BOTELLA RETORNABLE","zona":"VILLARICA","botella":21181,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"04- SKOL LITRO","zona":"VILLARICA","botella":21187,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"02- BRAHMA SZ 269 LATA","zona":"VILLARICA","lata":21176,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"01- PILSEN EXTRA 269 LATA","zona":"VILLARICA","lata":21171,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"03- OURO FINO 269 LATA","zona":"VILLARICA","lata":21178,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"05- BUD 66 269 LATA","zona":"VILLARICA","lata":21188,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"01- PILSEN 940 BOTELLA RETORNABLE","zona":"SAN ALBERTO","botella":21170,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"02- BRAHMA 940 BOTELLA RETORNABLE","zona":"SAN ALBERTO","botella":21175,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"03- OURO FINO 940 BOTELLA RETORNABLE","zona":"SAN ALBERTO","botella":21181,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"04- SKOL LITRO","zona":"SAN ALBERTO","botella":21187,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"02- BRAHMA SZ 269 LATA","zona":"SAN ALBERTO","lata":21176,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"01- PILSEN EXTRA 269 LATA","zona":"SAN ALBERTO","lata":21171,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"03- OURO FINO 269 LATA","zona":"SAN ALBERTO","lata":21178,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"05- BUD 66 269 LATA","zona":"SAN ALBERTO","lata":21188,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"01- PILSEN 940 BOTELLA RETORNABLE","zona":"SANTA RITA","botella":21170,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"02- BRAHMA 940 BOTELLA RETORNABLE","zona":"SANTA RITA","botella":21175,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"03- OURO FINO 940 BOTELLA RETORNABLE","zona":"SANTA RITA","botella":21181,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"04- SKOL LITRO","zona":"SANTA RITA","botella":21187,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"02- BRAHMA SZ 269 LATA","zona":"SANTA RITA","lata":21176,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"01- PILSEN EXTRA 269 LATA","zona":"SANTA RITA","lata":21171,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"03- OURO FINO 269 LATA","zona":"SANTA RITA","lata":21178,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"05- BUD 66 269 LATA","zona":"SANTA RITA","lata":21188,"respeteActual":null,"respeteAnterior":null,"dispersion":[]},{"name":"01- PILSEN 940 BOTELLA RETORNABLE","zona":"CAAGUAZU","botella":21170,"respeteActual":0.7594843650835792,"respeteAnterior":0.7594843650835792,"dispersion":[{"precioskusinpromo":7500,"cantidad":"136","periodo":202211},{"precioskusinpromo":7000,"cantidad":"36","periodo":202211},{"precioskusinpromo":8000,"cantidad":"14","periodo":202211},{"precioskusinpromo":6500,"cantidad":"1","periodo":202211},{"precioskusinpromo":8500,"cantidad":"1","periodo":202211},{"precioskusinpromo":9000,"cantidad":"1","periodo":202211},{"precioskusinpromo":10000,"cantidad":"1","periodo":202211}]},{"name":"02- BRAHMA 940 BOTELLA RETORNABLE","zona":"CAAGUAZU","botella":21175,"respeteActual":0.7614649039666198,"respeteAnterior":0.7614649039666198,"dispersion":[{"precioskusinpromo":7000,"cantidad":"174","periodo":202211},{"precioskusinpromo":7500,"cantidad":"39","periodo":202211},{"precioskusinpromo":8000,"cantidad":"18","periodo":202211},{"precioskusinpromo":6500,"cantidad":"10","periodo":202211},{"precioskusinpromo":6000,"cantidad":"1","periodo":202211},{"precioskusinpromo":9000,"cantidad":"1","periodo":202211}]},{"name":"03- OURO FINO 940 BOTELLA RETORNABLE","zona":"CAAGUAZU","botella":21181,"respeteActual":0.5618835855096087,"respeteAnterior":0.5618835855096087,"dispersion":[{"precioskusinpromo":6000,"cantidad":"98","periodo":202211},{"precioskusinpromo":6500,"cantidad":"19","periodo":202211},{"precioskusinpromo":7000,"cantidad":"14","periodo":202211},{"precioskusinpromo":8000,"cantidad":"3","periodo":202211},{"precioskusinpromo":7500,"cantidad":"1","periodo":202211}]},{"name":"04- SKOL LITRO","zona":"CAAGUAZU","botella":21187,"respeteActual":0.7416101034828085,"respeteAnterior":0.7416101034828085,"dispersion":[{"precioskusinpromo":8500,"cantidad":"87","periodo":202211},{"precioskusinpromo":8000,"cantidad":"27","periodo":202211},{"precioskusinpromo":9000,"cantidad":"9","periodo":202211},{"precioskusinpromo":7500,"cantidad":"2","periodo":202211},{"precioskusinpromo":10000,"cantidad":"2","periodo":202211}]},{"name":"02- BRAHMA SZ 269 LATA","zona":"CAAGUAZU","lata":21176,"respeteActual":0.866184795842123,"respeteAnterior":0.866184795842123,"dispersion":[{"precioskusinpromo":3000,"cantidad":"205","periodo":202211},{"precioskusinpromo":3500,"cantidad":"23","periodo":202211},{"precioskusinpromo":2500,"cantidad":"5","periodo":202211},{"precioskusinpromo":4000,"cantidad":"2","periodo":202211},{"precioskusinpromo":2750,"cantidad":"1","periodo":202211}]},{"name":"01- PILSEN EXTRA 269 LATA","zona":"CAAGUAZU","lata":21171,"respeteActual":0.5306513409961686,"respeteAnterior":0.5306513409961686,"dispersion":[{"precioskusinpromo":4000,"cantidad":"13","periodo":202211},{"precioskusinpromo":3750,"cantidad":"2","periodo":202211},{"precioskusinpromo":4500,"cantidad":"2","periodo":202211},{"precioskusinpromo":3500,"cantidad":"1","periodo":202211}]},{"name":"03- OURO FINO 269 LATA","zona":"CAAGUAZU","lata":21178,"respeteActual":0.5684216756379585,"respeteAnterior":0.5684216756379585,"dispersion":[{"precioskusinpromo":3000,"cantidad":"64","periodo":202211},{"precioskusinpromo":3500,"cantidad":"17","periodo":202211},{"precioskusinpromo":4000,"cantidad":"2","periodo":202211}]},{"name":"05- BUD 66 269 LATA","zona":"CAAGUAZU","lata":21188,"respeteActual":0.568359375,"respeteAnterior":0.568359375,"dispersion":[{"precioskusinpromo":4500,"cantidad":"20","periodo":202211},{"precioskusinpromo":4000,"cantidad":"9","periodo":202211},{"precioskusinpromo":5000,"cantidad":"6","periodo":202211}]}]


