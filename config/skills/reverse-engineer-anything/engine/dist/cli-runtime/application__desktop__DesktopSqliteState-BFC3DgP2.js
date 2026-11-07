import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { AnalysisCancelledError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { init_sqliteDatabase, sqliteDatabaseSchema } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_stateFormats, plainRecord } from "./stateFormats-D613h6TX.js";

//#region dist/application/desktop/DesktopSqliteState.js
var ROW_LIMIT, MAX_TABLES, cellValue, report, readSqliteStateView;
function init_DesktopSqliteState() {
	return (init_DesktopSqliteState = __esmMin((() => {
		init_analysisErrorCore();
		init_sqliteDatabase();
		init_stateFormats();
		ROW_LIMIT = 500;
		MAX_TABLES = 64;
		cellValue = (cell) => {
			switch (cell.type) {
				case "null": return null;
				case "integer": {
					const value = Number(cell.value);
					return Number.isSafeInteger(value) ? value : { integer: cell.value };
				}
				case "real": return cell.value;
				case "text": return cell.value.includes("�") ? {
					text: cell.value,
					bytes_hex: cell.bytes_hex
				} : cell.value;
				case "blob": return { blob_hex: cell.hex };
			}
		};
		report = async (service, input, signal) => {
			const inspected = await service.inspect(input, signal === undefined ? {} : { signal });
			if (!inspected.ok) {
				if (inspected.error instanceof AnalysisCancelledError || inspected.error.cleanupIncomplete) throw inspected.error;
				return inspected.error.message;
			}
			const parsed = sqliteDatabaseSchema.safeParse(inspected.value.normalized_result);
			return parsed.success ? parsed.data : "unexpected SQLite report";
		};
		readSqliteStateView = async (service, database, signal) => {
			const inventory = await report(service, {
				path: database,
				schema_scope: "database"
			}, signal);
			if (typeof inventory === "string") return {
				ok: false,
				error: inventory
			};
			const tables = plainRecord();
			const ordinary = inventory.schema.tables.filter((table) => table.kind === "table");
			for (const table of ordinary.slice(0, MAX_TABLES)) {
				const selected = await report(service, {
					path: database,
					table: table.name,
					row_limit: ROW_LIMIT
				}, signal);
				if (typeof selected === "string") {
					tables[table.name] = { error: selected };
					continue;
				}
				const rows = selected.rows;
				tables[table.name] = {
					columns: rows?.columns ?? [],
					primary_key: table.columns.filter((column) => column.primary_key_position > 0).sort((left, right) => left.primary_key_position - right.primary_key_position).map((column) => column.name),
					rows: (rows?.values ?? []).map((row) => row.map(cellValue)),
					truncated: rows?.truncated ?? false
				};
			}
			return {
				ok: true,
				view: {
					tables,
					tables_truncated: ordinary.length > MAX_TABLES
				}
			};
		};
	})))();
}

//#endregion
init_DesktopSqliteState();
export { readSqliteStateView };