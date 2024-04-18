import { FormEvent, useCallback, useEffect, useState } from "react";

import styles from "./App.module.css";
import SearchIcon from "./assets/SearchIcon.tsx";
import searchRuc, { RucResponse, Source } from "./composables/searchRuc.tsx";

function App() {
	const [ruc, setRuc] = useState<number | undefined>();
	const [rucResponse, setRucResponse] = useState<RucResponse[]>();
	const [rucSelected, setRucSelected] = useState<Source | undefined>();
	const [load, setload] = useState<boolean>(false);

	//Methods
	const searchRUC = useCallback((): void => {
		if (!ruc || ruc.toString().length !== 11) {
			return;
		}

		setload(true);
		searchRuc(ruc)
			.then((data) => {
				if (!data) {
					throw new Error("Ruc not found");
				}

				setRucResponse(data);
				setload(false);
			})
			.catch((e) => {
				setRuc(undefined);

				console.error(e);
			});
	}, [ruc]);
	const changeRuc = (event: FormEvent<HTMLInputElement>) => {
		const value = (event.target as HTMLInputElement).value;

		const parseValue = parseInt(value, 10);

		if (!parseValue) {
			setRuc(undefined);

			return;
		}

		setRuc(parseValue);
	};
	const testing = () => {
		setRuc(20131312955);
	};

	//Listeners
	useEffect(() => {
		if (ruc?.toString().length === 11) {
			searchRUC();
		} else if (!ruc) {
			setRuc(undefined);
			setRucSelected(undefined);
		}
	}, [ruc, searchRUC]);

	useEffect(() => {
		if (rucResponse && rucResponse[0]) {
			setRucSelected(rucResponse[0]["_source"]);
		}
	}, [rucResponse]);

	//Render
	return (
		<article className={`${styles.article} ${rucSelected ? styles.on : null}`}>
			<header>
				<h1>Consulta RUC</h1>
				<div>
					<input
						id="ruc"
						type="number"
						min="0"
						placeholder="20131312955"
						value={ruc ?? ""}
						onInput={changeRuc}
					/>
					<button onClick={!load ? searchRUC : () => {}}>
						<SearchIcon
							height={36}
							width={36}
						/>
					</button>

					<nav>
						<a
							href="#"
							onClick={testing}
						>
							TEST
						</a>
						<a href="https://github.com/Kembec/consulta-peru.git">GITHUB</a>
					</nav>
				</div>
			</header>
			{rucSelected && (
				<section>
					<h2>{rucSelected["nombre-o-razon-social"]}</h2>
					<div>
						<strong>RUC:</strong>
						<span>{rucSelected["ruc"]}</span>
					</div>
					<div>
						<strong>ESTADO DEL CONTRIBUYENTE:</strong>
						<span>{rucSelected["estado-del-contribuyente"]}</span>
					</div>
					<div>
						<strong>CONDICIÓN DE DOMICILIO:</strong>
						<span>{rucSelected["condicion-de-domicilio"]}</span>
					</div>
					{rucSelected["ubigeo"] ? (
						<div>
							<strong>UBIGEO:</strong>
							<span>{rucSelected["ubigeo"]}</span>
						</div>
					) : null}
					{rucSelected["tipo-de-via"] !== "-" ? (
						<div>
							<strong>TIPO DE VÍA:</strong>
							<span>{rucSelected["tipo-de-via"]}</span>
						</div>
					) : null}
					{rucSelected["nombre-de-via"] !== "-" ? (
						<div>
							<strong>NOMBRE DE VÍA:</strong>
							<span>{rucSelected["nombre-de-via"]}</span>
						</div>
					) : null}
					{rucSelected["codigo-de-zona"] !== "-" ? (
						<div>
							<strong>CÓDIGO DE ZONA:</strong>
							<span>{rucSelected["codigo-de-zona"]}</span>
						</div>
					) : null}
					{rucSelected["tipo-de-zona"] !== "-" ? (
						<div>
							<strong>TIPO DE ZONA:</strong>
							<span>{rucSelected["tipo-de-zona"]}</span>
						</div>
					) : null}
					{rucSelected["numero"] !== "-" ? (
						<div>
							<strong>NÚMERO:</strong>
							<span>{rucSelected["numero"]}</span>
						</div>
					) : null}
					{rucSelected["interior"] !== "-" ? (
						<div>
							<strong>INTERIOR:</strong>
							<span>{rucSelected["interior"]}</span>
						</div>
					) : null}
					{rucSelected["lote"] !== "-" ? (
						<div>
							<strong>LOTE:</strong>
							<span>{rucSelected["lote"]}</span>
						</div>
					) : null}
					{rucSelected["departamento"] !== "-" ? (
						<div>
							<strong>DEPARTAMENTO:</strong>
							<span>{rucSelected["departamento"]}</span>
						</div>
					) : null}
					{rucSelected["manzana"] !== "-" ? (
						<div>
							<strong>MANZANA:</strong>
							<span>{rucSelected["manzana"]}</span>
						</div>
					) : null}
					{rucSelected["kilometro"] !== "-" ? (
						<div>
							<strong>KILÓMETRO:</strong>
							<span>{rucSelected["kilometro"]}</span>
						</div>
					) : null}
				</section>
			)}
		</article>
	);
}

export default App;
