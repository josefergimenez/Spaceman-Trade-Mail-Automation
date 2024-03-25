
const BOTELLAS = [21170, 21175, 21181, 21187]
const LATAS = [21167, 21150, 21178, 21189]
const NAMES = {
    21170: "01- PILSEN 940 BOTELLA RETORNABLE",
    21175: "02- BRAHMA 940 BOTELLA RETORNABLE",
    21181: "03- OURO FINO 940 BOTELLA RETORNABLE",
    21187: "04- SKOL LITRO",
    21167: "01- PILSEN 269 LATA",
    22350: "02- BRAHMA 269 LATA",
    21178: "03- OURO FINO 269 LATA",
    21189: "05- BUD 66 310 LATA",

}
const TABLE = '"public"."tabla_prueba"'
const ZONAS = [
    { value: 110, label: "CENTRO MBARETE" },
    { value: 13, label: "GRAN ASU" },
    { value: 8, label: "OVIEDO" },
    { value: 6, label: "CDE" },
    { value: 4, label: "ENCARNACION" },
    { value: 115, label: "SALA BODEGAS" },
    { value: 117, label: "SANTANI" },
    { value: 9, label: "VILLARICA" },
    { value: 2, label: "SAN ALBERTO" },
    { value: 11, label: "SANTA RITA" },
    { value: 14, label: "CAAGUAZU" },
]

async function main(dbClient, from1, to1, from2, to2, from12, to12, from22, to22) {
    //return MOCKDATA
    const response = [];
    //CONDICION WHERE PARA LA BUSQUEDA EN LA DB
    const periodQuery = getSqlPeriodClause(from2, to2)
    const periodPrevQuery = getSqlPeriodClause(from1, to1)

    const periodQuery2 = getSqlPeriodClause(from22, to22)
    const periodPrevQuery2 = getSqlPeriodClause(from12, to12)

    let query = ''

    query = `SELECT
              id4 AS zona,
              idlineaproducto AS botella,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND tienedisponible <> 'NO VENDE' AND ${periodQuery} THEN 1 ELSE 0 END) AS total_respeto_actual,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND tienedisponible <> 'NO VENDE' AND ${periodPrevQuery} THEN 1 ELSE 0 END) AS total_respeto_anterior,
              SUM(CASE WHEN tienedisponible <> 'No vende' AND ${periodQuery} THEN 1 ELSE 0 END) AS total_disponible_actual,
              SUM(CASE WHEN tienedisponible <> 'No vende' AND ${periodPrevQuery} THEN 1 ELSE 0 END) AS total_disponible_anterior,
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

    console.log(query)
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
              idlineaproducto AS botella,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND tienedisponible <> 'NO VENDE' AND ${periodQuery2} THEN 1 ELSE 0 END) AS total_respeto_actual,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND tienedisponible <> 'NO VENDE' AND ${periodPrevQuery2} THEN 1 ELSE 0 END) AS total_respeto_anterior,
              SUM(CASE WHEN tienedisponible <> 'No vende' AND ${periodQuery2} THEN 1 ELSE 0 END) AS total_disponible_actual,
              SUM(CASE WHEN tienedisponible <> 'No vende' AND ${periodPrevQuery2} THEN 1 ELSE 0 END) AS total_disponible_anterior,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND ${periodQuery2} THEN volpromediomensual ELSE 0 END) AS total_respeta_volumen_actual,
              SUM(CASE WHEN respetanorespeta = 'NO RESPETA' AND ${periodQuery2} THEN volpromediomensual ELSE 0 END) AS total_no_respeta_volumen_actual,
              SUM(CASE WHEN respetanorespeta = 'RESPETA' AND ${periodPrevQuery2} THEN volpromediomensual ELSE 0 END) AS total_respeta_volumen_anterior,
              SUM(CASE WHEN respetanorespeta = 'NO RESPETA' AND ${periodPrevQuery2} THEN volpromediomensual ELSE 0 END) AS total_no_respeta_volumen_anterior
            FROM
              ${TABLE}
            WHERE
              (${periodQuery2} OR ${periodPrevQuery2})
            GROUP BY
              id4,
              idlineaproducto;`

    resultadosAgrupados = await dbClient.query(query);
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

        if (botellaNombre && botellaNombre.includes("LATA")) {
            response.push({
                name: botellaNombre,
                zona: zonaLabel,
                lata: Number(resultado.botella),
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
    console.log(query)
    let resultadosDispersión = await dbClient.query(query);
    // resultadosDispersión = mockdata
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
    return response

}

function respetePromediado(volumenNoRespeta, volumenRespeta, skuDisponible, skuRespete) {
    try {
        const respetePonderado = volumenRespeta / (volumenRespeta + volumenNoRespeta)
        const respeteFisico = skuRespete / skuDisponible
        const respete = (respeteFisico + respetePonderado) / 2
        if (typeof (respete) == 'number') {
            return respete
        }
        return NaN

    } catch { return NaN }

}

const getSqlPeriodClause = (startDate1, endDate1) => {
    const formatISODate = (date) => date.toISOString().split('T')[0];

    let clause = `(fechayhoradelaencuesta >= '${formatISODate(startDate1)}' AND fechayhoradelaencuesta <= '${formatISODate(endDate1)}')`;

    return clause
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

    //return "(fechayhoradelaencuesta BETWEEN '2022-11-01' AND '2022-11-30')"
    return `(fechayhoradelaencuesta BETWEEN '${startDate}' AND '${endDate}')`;
}

function obtenerZonaLabelPorId(zonaId) {
    const zona = ZONAS.find(z => z.value === zonaId);
    return zona ? zona.label : "Zona Desconocida";
}

module.exports = { main }