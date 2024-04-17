export interface Source {
	"codigo-de-zona": string;
	"condicion-de-domicilio": string;
	"estado-del-contribuyente": string;
	"nombre-de-via": string;
	"nombre-o-razon-social": string;
	"tipo-de-via": string;
	"tipo-de-zona": string;
	departamento: string;
	interior: string;
	kilometro: string;
	lote: string;
	manzana: string;
	numero: string;
	ruc: number;
	ubigeo: null | number;
}
export interface RucResponse {
	_id: string;
	_index: string;
	_score: number;
	_source: Source;
}

async function useSearchRuc(ruc: number): Promise<RucResponse[] | void> {
	const apiUrl = import.meta.env.VITE_API_URL;

	return fetch(`${apiUrl}/api/search/${ruc}`)
		.then((response) => response.json())
		.then((data: RucResponse[]) => {
			if (data.length > 0) {
				return data;
			}
			throw new Error("Ruc not found");
		})
		.catch((error) => {
			console.error(error);
		});
}

export default useSearchRuc;
