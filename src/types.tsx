export type Beer = {
    id: string,
    percentage: number,
    pp: number,
}

export type Cluster = {
    name: string,
    percentageOne: number,
    percentageTwo: number,
    pp: number,
}

export type ClusterWithProducts = {
    zone: [{
        name: string,
        product: [{
        name: string,
        percentageOne: number,
        percentageTwo: number,
        pp: number
        }]}]}

export type BeerDispersion = {
    id: string,
    price: string
    }
