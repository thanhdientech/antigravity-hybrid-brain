import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { f as parseEvidence, l as immutableEvidence, u as init_evidence } from "./evidence-Cy8VjugF.js";
import { f as init_evidenceErrors, l as EvidenceIntegrityError } from "./digests-Ct-nksBF.js";
import { z } from "zod";

//#region dist/domain/evidenceInputContract.js
var declarations, referenceAlternatives, borrowedDeclarations, isDeclaredEvidenceInput, declareEvidenceInput, declareEvidenceReferenceAlternative, declareBorrowedEvidenceInput, contracts, identity, getEvidenceInputContract, compile, replaceWrappedSchema, objectContract, arrayContract, unionContract;
function init_evidenceInputContract() {
	return (init_evidenceInputContract = __esmMin((() => {
		init_result();
		declarations = z.registry();
		referenceAlternatives = z.registry();
		borrowedDeclarations = new WeakMap();
		isDeclaredEvidenceInput = (schema) => declarations.get(schema) !== undefined;
		declareEvidenceInput = (schema) => {
			declarations.add(schema, { kind: "evidence" });
			return schema;
		};
		declareEvidenceReferenceAlternative = (schema) => {
			referenceAlternatives.add(schema, { retained: true });
			return schema;
		};
		declareBorrowedEvidenceInput = (schema, declaration) => {
			const owner = {};
			borrowedDeclarations.set(owner, declaration);
			declarations.add(schema, {
				kind: "borrowed",
				owner
			});
			return schema;
		};
		contracts = new WeakMap();
		identity = (schema, hasEvidenceReferenceAlternative = false) => ({
			frameSchema: schema,
			hasEvidence: false,
			hasEvidenceReferenceAlternative,
			resolve: (input) => ok(input)
		});
		getEvidenceInputContract = (schema) => {
			const existing = contracts.get(schema);
			if (existing !== undefined) return existing;
			const result = compile(schema);
			contracts.set(schema, result);
			return result;
		};
		compile = (schema) => {
			if (referenceAlternatives.get(schema) !== undefined) return identity(schema, true);
			const declared = declarations.get(schema);
			if (declared?.kind === "evidence") return {
				frameSchema: z.unknown().nonoptional(),
				hasEvidence: true,
				hasEvidenceReferenceAlternative: true,
				resolve: (input, visit, path = []) => visit(input, path)
			};
			if (declared?.kind === "borrowed") {
				const declaration = borrowedDeclarations.get(declared.owner);
				if (declaration === undefined) throw new TypeError("Borrowed Evidence schema has no owning declaration");
				const source = getEvidenceInputContract(declaration);
				return {
					...source,
					frameSchema: schema
				};
			}
			if (schema instanceof z.ZodObject) return objectContract(schema);
			if (schema instanceof z.ZodArray) return arrayContract(schema);
			if (schema instanceof z.ZodUnion) return unionContract(schema);
			if (schema instanceof z.ZodOptional || schema instanceof z.ZodExactOptional || schema instanceof z.ZodNullable || schema instanceof z.ZodDefault || schema instanceof z.ZodPrefault || schema instanceof z.ZodNonOptional || schema instanceof z.ZodReadonly) {
				const child = getEvidenceInputContract(schema.unwrap());
				if (!child.hasEvidence) return identity(schema, child.hasEvidenceReferenceAlternative);
				return {
					hasEvidence: true,
					hasEvidenceReferenceAlternative: child.hasEvidenceReferenceAlternative,
					frameSchema: replaceWrappedSchema(schema, child.frameSchema),
					resolve: (input, visit, path = []) => input === undefined || input === null && schema instanceof z.ZodNullable ? ok(input) : child.resolve(input, visit, path)
				};
			}
			return identity(schema);
		};
		replaceWrappedSchema = (schema, innerType) => {
			const definition = {
				...schema.def,
				innerType
			};
			return z.clone(schema, definition, { parent: true });
		};
		objectContract = (schema) => {
			const children = Object.entries(schema.shape).map(([key, child]) => [key, getEvidenceInputContract(child)]);
			const selected = children.filter(([, child]) => child.hasEvidence);
			const hasEvidenceReferenceAlternative = children.some(([, child]) => child.hasEvidenceReferenceAlternative);
			if (selected.length === 0) return identity(schema, hasEvidenceReferenceAlternative);
			return {
				hasEvidence: true,
				hasEvidenceReferenceAlternative,
				frameSchema: schema.clone({
					...schema.def,
					shape: Object.fromEntries(children.map(([key, child]) => [key, child.frameSchema]))
				}, { parent: true }),
				resolve: (input, visit, path = []) => {
					if (typeof input !== "object" || input === null || Array.isArray(input)) return ok(input);
					let result = input;
					for (const [key, child] of selected) {
						if (!Object.hasOwn(result, key)) continue;
						const value = child.resolve(result[key], visit, [...path, key]);
						if (!value.ok) return value;
						if (value.value !== result[key]) result = {
							...result,
							[key]: value.value
						};
					}
					return ok(result);
				}
			};
		};
		arrayContract = (schema) => {
			const child = getEvidenceInputContract(schema.element);
			if (!child.hasEvidence) return identity(schema, child.hasEvidenceReferenceAlternative);
			return {
				hasEvidence: true,
				hasEvidenceReferenceAlternative: child.hasEvidenceReferenceAlternative,
				frameSchema: schema.clone({
					...schema.def,
					element: child.frameSchema
				}, { parent: true }),
				resolve: (input, visit, path = []) => {
					if (!Array.isArray(input)) return ok(input);
					let result = input;
					for (const [index, item] of input.entries()) {
						const value = child.resolve(item, visit, [...path, index]);
						if (!value.ok) return value;
						if (value.value !== item) {
							if (result === input) result = input.slice();
							result[index] = value.value;
						}
					}
					return ok(result);
				}
			};
		};
		unionContract = (schema) => {
			const options = schema.options.map((option) => getEvidenceInputContract(option));
			const hasEvidenceReferenceAlternative = options.some((option) => option.hasEvidenceReferenceAlternative);
			if (!options.some((option) => option.hasEvidence)) return identity(schema, hasEvidenceReferenceAlternative);
			const branches = new WeakMap();
			const frame = z.union(options.map((option) => option.frameSchema.transform((value) => {
				if (typeof value === "object" && value !== null) branches.set(value, option);
				return value;
			})));
			return {
				hasEvidence: true,
				hasEvidenceReferenceAlternative,
				frameSchema: frame.clone({
					...frame.def,
					...schema.def.error === undefined ? {} : { error: schema.def.error },
					...schema.def.checks === undefined ? {} : { checks: schema.def.checks }
				}),
				resolve: (input, visit, path = []) => {
					const selected = typeof input === "object" && input !== null ? branches.get(input) : undefined;
					return selected?.resolve(input, visit, path) ?? ok(input);
				}
			};
		};
	})))();
}

//#endregion
//#region dist/domain/validationFailure.js
var describeValidationFailure;
function init_validationFailure() {
	return (init_validationFailure = __esmMin((() => {
		describeValidationFailure = (cause) => {
			if (!(cause instanceof z.ZodError)) return cause instanceof Error ? cause.message : String(cause);
			const [first, ...rest] = cause.issues;
			const location = first === undefined || first.path.length === 0 ? "the document root" : first.path.map(String).join(".");
			return `at ${location}: ${first?.message ?? "invalid value"}${rest.length === 0 ? "" : ` (${String(rest.length)} more issues)`}`;
		};
	})))();
}

//#endregion
//#region dist/domain/evidenceValidation.js
var safeParseEvidence, safeParseImmutableEvidence, readEvidence, readImmutableEvidence, authenticateEvidence, readEvidencePayload, integrityFailure;
function init_evidenceValidation() {
	return (init_evidenceValidation = __esmMin((() => {
		init_evidence();
		init_evidenceErrors();
		init_validationFailure();
		init_result();
		safeParseEvidence = (input) => authenticateEvidence(input, parseEvidence);
		safeParseImmutableEvidence = (input) => authenticateEvidence(input, immutableEvidence);
		readEvidence = (input) => {
			const parsed = safeParseEvidence(input);
			return parsed.ok ? parsed : err(integrityFailure(parsed.error));
		};
		readImmutableEvidence = (input) => {
			const parsed = safeParseImmutableEvidence(input);
			return parsed.ok ? parsed : err(integrityFailure(parsed.error));
		};
		authenticateEvidence = (input, parse) => {
			try {
				return ok(parse(input));
			} catch (cause) {
				if (!(cause instanceof z.ZodError)) throw cause;
				return err(cause);
			}
		};
		readEvidencePayload = (schema, input) => {
			const parsed = schema.safeParse(input);
			return parsed.success ? ok(parsed.data) : err(integrityFailure(parsed.error));
		};
		integrityFailure = (cause) => {
			const message = `Evidence validation failed ${describeValidationFailure(cause)}`;
			return new EvidenceIntegrityError(message, {
				cause,
				userMessage: message
			});
		};
	})))();
}

//#endregion
export { safeParseEvidence as a, init_validationFailure as c, declareEvidenceReferenceAlternative as d, getEvidenceInputContract as f, readImmutableEvidence as i, declareBorrowedEvidenceInput as l, readEvidence as n, safeParseImmutableEvidence as o, init_evidenceInputContract as p, readEvidencePayload as r, describeValidationFailure as s, init_evidenceValidation as t, declareEvidenceInput as u };