import { isMap, parseDocument } from "yaml";
import { err, ok } from "./result.js";
export class SkillManifestMetadataError extends Error {
    metadata;
    _tag = "SkillManifestMetadataError";
    constructor(message, metadata) {
        super(message);
        this.metadata = metadata;
    }
}
const emptyMetadata = () => ({
    version: null,
    toolCount: null,
    hasToolCount: false,
    hasCatalogDigest: false,
});
/** The frontmatter range owns YAML; body examples never supply metadata. */
const readFrontmatter = (content) => {
    const opening = /^---\r?\n/u.exec(content);
    if (opening === null)
        return err(new SkillManifestMetadataError("Skill manifest has no YAML frontmatter", emptyMetadata()));
    const remainder = content.slice(opening[0].length);
    const closing = /^---(?:\r?\n|$)/mu.exec(remainder);
    if (closing === null)
        return err(new SkillManifestMetadataError("Skill manifest YAML frontmatter is unterminated", emptyMetadata()));
    const document = parseDocument(remainder.slice(0, closing.index), {
        logLevel: "silent",
    });
    if (document.errors.length > 0)
        return err(new SkillManifestMetadataError(`Invalid skill YAML frontmatter: ${document.errors.map((error) => error.message).join("; ")}`, emptyMetadata()));
    if (document.warnings.length > 0)
        return err(new SkillManifestMetadataError(`Unsupported skill YAML frontmatter: ${document.warnings.map((warning) => warning.message).join("; ")}`, emptyMetadata()));
    if (!isMap(document.contents))
        return err(new SkillManifestMetadataError("Skill YAML frontmatter must be a mapping", emptyMetadata()));
    return ok({
        document,
        body: remainder.slice(closing.index + closing[0].length),
    });
};
const metadataOf = (document) => {
    const metadata = document.get("metadata", true);
    if (metadata === undefined)
        return ok(emptyMetadata());
    if (!isMap(metadata))
        return err(new SkillManifestMetadataError("Skill metadata must be a mapping", emptyMetadata()));
    const version = document.getIn(["metadata", "version"]);
    const toolCount = document.getIn(["metadata", "tool_count"]);
    const facts = {
        version: typeof version === "string" && version.length > 0 ? version : null,
        toolCount: typeof toolCount === "number" &&
            Number.isSafeInteger(toolCount) &&
            toolCount >= 0
            ? toolCount
            : null,
        hasToolCount: metadata.has("tool_count"),
        hasCatalogDigest: metadata.has("catalog_digest"),
    };
    const issues = [];
    if (metadata.has("version") && facts.version === null)
        issues.push("version must be a nonempty string");
    if (facts.hasToolCount && facts.toolCount === null)
        issues.push("tool_count must be a safe nonnegative integer");
    return issues.length === 0
        ? ok(facts)
        : err(new SkillManifestMetadataError(`Invalid skill metadata: ${issues.join("; ")}`, facts));
};
export const parseSkillManifestMetadata = (content) => {
    const frontmatter = readFrontmatter(content);
    return frontmatter.ok ? metadataOf(frontmatter.value.document) : frontmatter;
};
/** Update only authored YAML frontmatter, retaining the instruction body. */
export const addSkillManifestToolCount = (content, toolCount) => {
    const frontmatter = readFrontmatter(content);
    if (!frontmatter.ok)
        return frontmatter;
    const metadata = metadataOf(frontmatter.value.document);
    if (!metadata.ok)
        return metadata;
    if (metadata.value.version === null)
        return err(new SkillManifestMetadataError("Missing authored skill version", metadata.value));
    if (metadata.value.hasToolCount || metadata.value.hasCatalogDigest)
        return err(new SkillManifestMetadataError("Catalog metadata belongs in the generated skill, not the authored source", metadata.value));
    if (!Number.isSafeInteger(toolCount) || toolCount < 0)
        return err(new SkillManifestMetadataError("Generated tool_count must be a safe nonnegative integer", metadata.value));
    const { document, body } = frontmatter.value;
    document.setIn(["metadata", "tool_count"], toolCount);
    return ok(`---\n${document.toString({ lineWidth: 0 })}---\n${body}`);
};
