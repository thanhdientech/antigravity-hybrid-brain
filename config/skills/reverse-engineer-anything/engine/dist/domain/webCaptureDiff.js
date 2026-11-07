import { digestCanonicalValue } from "./canonicalDigest.js";
import { compareUnicodeCodePoints, compositeKey, } from "./unicodeCodePointOrder.js";
import { webResourceComparisonIdentity } from "./webInventory.js";
import { webCaptureDiffSchema, } from "./webCaptureDiffSchemas.js";
import { fingerprintWebCaptureFrames } from "./webCaptureFrameComparison.js";
/** Compare normalized observations without treating incomplete absence as proof. */
export const compareWebCaptures = (input) => {
    const before = input.before.inspection;
    const after = input.after.inspection;
    const dimensions = compareWebCaptureDimensions(input);
    const statuses = Object.values(dimensions).map(({ status }) => status);
    return webCaptureDiffSchema.parse({
        overall_status: statuses.includes("changed")
            ? "changed"
            : statuses.includes("unknown")
                ? "unknown"
                : "unchanged",
        before_target: {
            target_id: before.target.target_id,
            url: before.target.url,
        },
        after_target: {
            target_id: after.target.target_id,
            url: after.target.url,
        },
        dimensions,
        limitations: [
            "A changed status proves an observed difference; an unknown status means necessary comparison facts or coverage were unavailable.",
            ...(!domValueLengthsComparable(before.dom, after.dom)
                ? [
                    "DOM value-length comparison is unknown because units are missing or different; independent structural differences can still establish a change.",
                ]
                : []),
            "Network comparison covers only activity observed after each CDP attachment. WebSocket connections with the same URL are compared as an unordered collection of ordered frame streams, retaining connection counts; their individual identities are not stable across captures.",
            "Accessibility structure is compared when the tree is complete; text additionally requires complete selected text capture. A missing role leaves that node's role comparison unknown; independently observed differences can still establish a change.",
            "Storage key inventories are compared only when selected and complete; usage and quota are compared only when reported. Redacted content is compared through complete SHA-256 fingerprints.",
        ],
    });
};
const compareIdentities = (before, after) => {
    const changes = [];
    for (const [identity, fingerprint] of before) {
        const next = after.get(identity);
        if (next === undefined)
            changes.push({ identity, change: "removed" });
        else if (next !== fingerprint)
            changes.push({ identity, change: "modified" });
    }
    for (const identity of after.keys())
        if (!before.has(identity))
            changes.push({ identity, change: "added" });
    return changes.sort((left, right) => compareUnicodeCodePoints(left.identity, right.identity) ||
        compareUnicodeCodePoints(left.change, right.change));
};
const compareDimension = (before, after, complete, reason, inventoryComplete = complete) => {
    // Membership evidence can be complete even when selected content is unknown.
    const all = compareIdentities(before, after).filter(({ identity, change }) => change === "modified" ||
        (typeof inventoryComplete === "boolean"
            ? inventoryComplete
            : inventoryComplete(identity)));
    if (all.length > 0)
        return {
            status: "changed",
            total_changes: all.length,
            changes: all,
            reason: null,
        };
    return complete
        ? {
            status: "unchanged",
            total_changes: 0,
            changes: [],
            reason: null,
        }
        : {
            status: "unknown",
            total_changes: 0,
            changes: [],
            reason,
        };
};
const accessibilityDimension = (before, after) => {
    const beforeAccess = accessibilityComparable(before);
    const afterAccess = accessibilityComparable(after);
    const textComparable = beforeAccess.text && afterAccess.text;
    const nodesComparable = beforeAccess.nodes && afterAccess.nodes;
    const rolesComplete = before.accessibility.nodes.every((node) => node.role !== null) &&
        after.accessibility.nodes.every((node) => node.role !== null);
    const reason = "Accessibility tree, role, or text capture was incomplete in at least one observation.";
    if (!nodesComparable)
        return {
            status: "unknown",
            total_changes: 0,
            changes: [],
            reason,
        };
    return compareDimension(singleton("accessibility_tree", digestCanonicalValue(accessibilityProjection(before.accessibility, after.accessibility, textComparable))), singleton("accessibility_tree", digestCanonicalValue(accessibilityProjection(after.accessibility, before.accessibility, textComparable))), beforeAccess.complete && afterAccess.complete && rolesComplete, reason);
};
const storageDimension = (before, after) => {
    const keysComplete = storageKeysComparable(before) && storageKeysComparable(after);
    const usageComplete = before.storage.usage_bytes !== null &&
        after.storage.usage_bytes !== null &&
        before.storage.quota_bytes !== null &&
        after.storage.quota_bytes !== null;
    const comparableFingerprints = storageFingerprintIdentities(before.storage, after.storage);
    const indexedDbVersionCovered = [before.storage, after.storage].every((storage) => storage.content_fingerprints
        .filter(({ scope }) => scope === "indexed_db_schema")
        .every(({ projection_version }) => projection_version === 2));
    return compareDimension(storageMap(before.storage, keysComplete, usageComplete, comparableFingerprints), storageMap(after.storage, keysComplete, usageComplete, comparableFingerprints), keysComplete &&
        usageComplete &&
        indexedDbVersionCovered &&
        before.storage.fingerprints_complete &&
        after.storage.fingerprints_complete, "Storage fingerprints, inventories, usage, quota, or IndexedDB schema version coverage were unavailable or truncated in at least one observation.", keysComplete);
};
const compareWebCaptureDimensions = (input) => {
    const before = input.before.inspection;
    const after = input.after.inspection;
    return {
        dom_structure: domDimension(before, after),
        scripts: scriptsDimension(before, after),
        resources: compareResources(before.resources, after.resources, sectionsComplete(before, ["resources"]) &&
            sectionsComplete(after, ["resources"]), "Resource inventory or content-size evidence was incomplete in at least one observation."),
        network: networkDimension(before, after),
        metadata: compareAggregate("metadata", metadataProjection(before), metadataProjection(after), sectionsComplete(before, ["metadata"]) &&
            sectionsComplete(after, ["metadata"]), "Safe metadata capture was incomplete in at least one observation."),
        webmcp: webMcpDimension(input.before.webmcp, input.after.webmcp),
        accessibility: accessibilityDimension(before, after),
        storage: storageDimension(before, after),
    };
};
const compareResources = (before, after, complete, reason) => {
    const left = resourceGroups(before);
    const right = resourceGroups(after);
    const changes = [];
    let unresolved = false;
    for (const identity of new Set([...left.keys(), ...right.keys()])) {
        const leftSizes = left.get(identity);
        const rightSizes = right.get(identity);
        if (leftSizes === undefined || rightSizes === undefined) {
            if (!complete)
                unresolved = true;
            else
                changes.push({
                    identity,
                    change: leftSizes === undefined ? "added" : "removed",
                });
            continue;
        }
        // Stable inventories deduplicate identical observations. A null size also
        // loses multiplicity, so do not infer modifications from the remaining
        // known sizes in a group that contains unknown size evidence.
        if (leftSizes.has(null) || rightSizes.has(null)) {
            unresolved = true;
            continue;
        }
        if (!sameResourceSizes(leftSizes, rightSizes))
            changes.push({ identity, change: "modified" });
    }
    if (changes.length > 0)
        return {
            status: "changed",
            total_changes: changes.length,
            changes: changes.sort((leftChange, rightChange) => compareUnicodeCodePoints(leftChange.identity, rightChange.identity)),
            reason: null,
        };
    if (!complete || unresolved)
        return { status: "unknown", total_changes: 0, changes: [], reason };
    return { status: "unchanged", total_changes: 0, changes: [], reason: null };
};
const resourceGroups = (resources) => {
    const groups = new Map();
    for (const resource of resources) {
        const identity = webResourceComparisonIdentity(resource);
        const sizes = groups.get(identity);
        if (sizes === undefined)
            groups.set(identity, new Set([resource.content_size]));
        else
            sizes.add(resource.content_size);
    }
    return groups;
};
const sameResourceSizes = (left, right) => left.size === right.size && [...left].every((size) => right.has(size));
const bodyShapesSelected = (inspection) => !inspection.completeness.excluded.some(({ section, reason }) => section === "json_body_shapes" && reason === "not_approved") &&
    (inspection.network.requests.length === 0 ||
        inspection.network.requests.some(({ body_shapes }) => body_shapes.status !== "not_approved"));
const webSocketShapesSelected = (inspection) => !inspection.completeness.excluded.some(({ section, reason }) => section === "websocket_shapes" && reason === "not_approved");
const networkIdentity = (request) => `net_${digestCanonicalValue({ method: request.method, url: request.url, resource_type: request.resource_type })}`;
/** An unknown request type can match any observed type at the same method/URL. */
const networkIdentityCoverage = (before, after) => {
    const complete = [before, after].every((inspection) => inspection.network.requests.every(({ resource_type }) => resource_type !== null));
    const ambiguousIdentities = new Set();
    if (complete)
        return { complete, ambiguousIdentities };
    const matchKey = (request) => JSON.stringify([request.method, request.url]);
    const unknownTypes = (inspection) => {
        const groups = new Map();
        for (const request of inspection.network.requests) {
            const key = matchKey(request);
            groups.set(key, groups.get(key) === true || request.resource_type === null);
        }
        return groups;
    };
    const retainPotentialMatches = (inspection, peer) => {
        for (const request of inspection.network.requests) {
            const peerUnknown = peer.get(matchKey(request));
            if (peerUnknown === true ||
                (peerUnknown === false && request.resource_type === null))
                ambiguousIdentities.add(networkIdentity(request));
        }
    };
    retainPotentialMatches(before, unknownTypes(after));
    retainPotentialMatches(after, unknownTypes(before));
    return { complete, ambiguousIdentities };
};
const networkResponseFields = [
    "status",
    "mime_type",
    "encoded_data_length",
];
const redirectMetadataFields = [
    ...networkResponseFields,
    "resource_type",
];
/** Own both comparable fields and completeness instead of deriving it from set sizes. */
const sharedNetworkMetadata = (before, after) => {
    const shared = new Map();
    let complete = true;
    const retainKnownFields = (identity, metadata, required) => {
        const fields = shared.get(identity) ?? new Set(required);
        for (const field of required)
            if (metadata[field] === null) {
                fields.delete(field);
                complete = false;
            }
        shared.set(identity, fields);
    };
    for (const inspection of [before, after])
        for (const request of inspection.network.requests) {
            const identity = networkIdentity(request);
            retainKnownFields(identity, request, networkResponseFields);
            for (const [index, redirect] of (request.redirects ?? []).entries())
                retainKnownFields(redirectNetworkIdentity(identity, index), redirect, redirectMetadataFields);
        }
    return { fields: shared, complete };
};
const redirectNetworkIdentity = (identity, index) => compositeKey([identity, "redirect", index]);
/** Section lists and per-kind dropped counts independently limit absence evidence. */
const networkInventoryComplete = (inspection, sections) => sectionsComplete(inspection, sections) &&
    sections.every((section) => inspection.completeness.dropped_events[section] === 0);
const webSocketEventHasOpcode = (event) => event !== undefined && event.opcode !== null;
const webSocketEventHasPayloadBytes = (event) => webSocketEventHasOpcode(event) && event.payload_bytes !== null;
const webSocketEventHasPayloadShape = (event) => webSocketEventHasOpcode(event) && event.payload_shape !== null;
const webSocketOpcodesKnown = (inspection) => inspection.network.websocket_connections.every((connection) => connection.events.every(webSocketEventHasOpcode));
const networkDimension = (before, after) => {
    const requestsComplete = [before, after].every((inspection) => networkInventoryComplete(inspection, ["network_requests"]));
    const webSocketFramesComplete = [before, after].every((inspection) => networkInventoryComplete(inspection, [
        "websocket_connections",
        "websocket_frames",
    ]));
    const webSocketInventoryComplete = [before, after].every((inspection) => networkInventoryComplete(inspection, [
        "websocket_connections",
        "websocket_frames",
    ]) && webSocketOpcodesKnown(inspection));
    const requestIdentities = networkIdentityCoverage(before, after);
    const metadata = sharedNetworkMetadata(before, after);
    const selected = bodyShapesSelected(before) && bodyShapesSelected(after);
    const webSocketShapes = webSocketShapesSelected(before) && webSocketShapesSelected(after);
    const projection = {
        metadataFields: metadata.fields,
        ambiguousIdentities: requestIdentities.ambiguousIdentities,
        initiatorsComplete: [before, after].every((inspection) => sectionsComplete(inspection, ["network_initiators"])),
    };
    const sources = new Map();
    if (selected) {
        const observedSources = (inspection) => {
            const result = new Map();
            for (const request of inspection.network.requests) {
                const identity = networkIdentity(request);
                const previous = result.get(identity);
                result.set(identity, {
                    request: previous?.request !== false && request.body_shapes.request !== null,
                    response: previous?.response !== false &&
                        request.body_shapes.response !== null,
                });
            }
            return result;
        };
        const left = observedSources(before);
        const right = observedSources(after);
        for (const [identity, coverage] of left) {
            const next = right.get(identity);
            sources.set(identity, {
                request: coverage.request && next?.request === true,
                response: coverage.response && next?.response === true,
            });
        }
    }
    const shapesComplete = !selected ||
        [before, after].every((inspection) => sectionsComplete(inspection, ["json_body_shapes"]) &&
            inspection.network.requests.every(({ body_shapes }) => body_shapes.status === "included"));
    const webSocketShapesComplete = !webSocketShapes ||
        [before, after].every((inspection) => sectionsComplete(inspection, ["websocket_shapes"]) &&
            inspection.network.websocket_connections.every((connection) => connection.events.every(webSocketEventHasPayloadShape)));
    const webSocketPayloadBytesComplete = [before, after].every((inspection) => inspection.network.websocket_connections.every((connection) => connection.events.every(webSocketEventHasPayloadBytes)));
    const beforeWebSockets = webSocketGroups(before);
    const afterWebSockets = webSocketGroups(after);
    const [beforeWebSocketPayload, afterWebSocketPayload] = webSocketPayloadMaps(beforeWebSockets, afterWebSockets, webSocketShapes, webSocketFramesComplete);
    const [beforeRequests, afterRequests] = networkComparisonMaps(networkMap(before, sources, projection), networkMap(after, sources, projection), networkInventoryComplete(before, ["network_requests"]), networkInventoryComplete(after, ["network_requests"]));
    const compared = compareDimension(new Map([
        ...beforeRequests,
        ...(webSocketInventoryComplete
            ? webSocketMetadataMap(beforeWebSockets)
            : []),
        ...beforeWebSocketPayload,
    ]), new Map([
        ...afterRequests,
        ...(webSocketInventoryComplete
            ? webSocketMetadataMap(afterWebSockets)
            : []),
        ...afterWebSocketPayload,
    ]), requestsComplete &&
        requestIdentities.complete &&
        projection.initiatorsComplete &&
        webSocketInventoryComplete &&
        shapesComplete &&
        webSocketPayloadBytesComplete &&
        webSocketShapesComplete, requestIdentities.complete
        ? "Network capture or selected HTTP/WebSocket payload-shape coverage is limited, unavailable, incomplete, or includes dropped network events."
        : "HTTP request identity is incomplete because a resource type is unavailable; potentially matching type groups cannot establish membership/content changes or complete network equality.", 
    // HTTP maps already retain only directionally proven membership/content
    // changes. WebSocket inventory uses its own coverage independently.
    (identity) => identity.startsWith("net_")
        ? true
        : identity.startsWith("ws_") && webSocketInventoryComplete);
    if (metadata.complete)
        return compared;
    const responseEvidenceReason = "HTTP response or redirect status, MIME type, byte count, or resource-type evidence is incomplete.";
    if (compared.status === "changed")
        return compared;
    return {
        status: "unknown",
        total_changes: 0,
        changes: [],
        reason: compared.reason === null
            ? responseEvidenceReason
            : `${responseEvidenceReason} ${compared.reason}`,
    };
};
const networkMap = (inspection, sources, projection) => {
    const grouped = new Map();
    for (const request of inspection.network.requests) {
        const identity = networkIdentity(request);
        // A missing type can move repeated requests between these buckets. Neither
        // their counts nor fingerprints establish a change to that typed group.
        if (projection.ambiguousIdentities.has(identity))
            continue;
        const shapes = sources.get(identity);
        const values = grouped.get(identity) ?? [];
        const response = {};
        for (const field of projection.metadataFields.get(identity) ?? [])
            response[field] = request[field];
        values.push(digestCanonicalValue({
            ...response,
            redirects: (request.redirects ?? []).map(({ request_timestamp: _requestTimestamp, redirect_event_timestamp: _redirectEventTimestamp, ...redirect }, index) => {
                const response = {};
                for (const field of projection.metadataFields.get(redirectNetworkIdentity(identity, index)) ?? [])
                    if (redirect[field] !== null)
                        response[field] = redirect[field];
                return {
                    url: redirect.url,
                    response_url: redirect.response_url,
                    method: redirect.method,
                    ...response,
                };
            }),
            ...(projection.initiatorsComplete
                ? { initiator: request.initiator }
                : {}),
            ...(shapes?.request === true
                ? { request_shape: request.body_shapes.request }
                : {}),
            ...(shapes?.response === true
                ? { response_shape: request.body_shapes.response }
                : {}),
        }));
        grouped.set(identity, values);
    }
    return grouped;
};
/** A partial multiset may omit any sample, including a distinct response. */
const networkComparisonMaps = (before, after, beforeComplete, afterComplete) => {
    const left = new Map();
    const right = new Map();
    for (const identity of new Set([...before.keys(), ...after.keys()])) {
        const previous = before.get(identity) ?? [];
        const next = after.get(identity) ?? [];
        if (!(beforeComplete && afterComplete) &&
            !(beforeComplete && !samplesContained(next, previous)) &&
            !(afterComplete && !samplesContained(previous, next)))
            continue;
        if (before.has(identity))
            left.set(identity, digestCanonicalValue([...previous].sort()));
        if (after.has(identity))
            right.set(identity, digestCanonicalValue([...next].sort()));
    }
    return [left, right];
};
const samplesContained = (samples, complete) => {
    const counts = new Map();
    for (const sample of complete)
        counts.set(sample, (counts.get(sample) ?? 0) + 1);
    for (const sample of samples) {
        const count = counts.get(sample) ?? 0;
        if (count === 0)
            return false;
        counts.set(sample, count - 1);
    }
    return true;
};
const webSocketGroups = (inspection) => {
    const groups = new Map();
    for (const connection of inspection.network.websocket_connections) {
        const stream = digestCanonicalValue(connection.events.map(({ direction, opcode }) => ({
            direction,
            opcode,
        })));
        const key = digestCanonicalValue({ url: connection.url, stream });
        const previous = groups.get(key);
        if (previous !== undefined)
            previous.connections.push(connection);
        else
            groups.set(key, {
                url: connection.url,
                stream,
                connections: [connection],
            });
    }
    return groups;
};
const webSocketMetadataMap = (groups) => {
    const byUrl = new Map();
    for (const group of groups.values()) {
        const streams = byUrl.get(group.url) ?? [];
        for (let index = 0; index < group.connections.length; index += 1)
            streams.push(group.stream);
        byUrl.set(group.url, streams);
    }
    return new Map([...byUrl].map(([url, streams]) => [
        `ws_${digestCanonicalValue(url)}`,
        digestCanonicalValue(streams.sort(compareUnicodeCodePoints)),
    ]));
};
const webSocketPayloadMaps = (beforeGroups, afterGroups, selected, inventoryComplete) => {
    const left = new Map();
    const right = new Map();
    // Retained positions cannot identify frames after any frame or connection
    // omission. A matching direction/opcode sequence does not prove alignment.
    if (!inventoryComplete)
        return [left, right];
    for (const [groupKey, beforeGroup] of beforeGroups) {
        const afterGroup = afterGroups.get(groupKey);
        if (afterGroup === undefined ||
            beforeGroup.connections.length !== afterGroup.connections.length)
            continue;
        const eventCount = beforeGroup.connections[0]?.events.length ?? 0;
        const comparableBytes = new Set();
        const comparableShapes = new Set();
        for (let index = 0; index < eventCount; index += 1) {
            if (beforeGroup.connections.every((connection) => webSocketEventHasPayloadBytes(connection.events[index])) &&
                afterGroup.connections.every((connection) => webSocketEventHasPayloadBytes(connection.events[index])))
                comparableBytes.add(index);
            // Compare only when every same-metadata connection has shape evidence
            // on both sides; this avoids assigning an unknown shape to a known one.
            if (selected &&
                beforeGroup.connections.every((connection) => webSocketEventHasPayloadShape(connection.events[index])) &&
                afterGroup.connections.every((connection) => webSocketEventHasPayloadShape(connection.events[index])))
                comparableShapes.add(index);
        }
        if (comparableBytes.size === 0 && comparableShapes.size === 0)
            continue;
        const project = (group) => digestCanonicalValue(group.connections
            .map((connection) => connection.events.map((event, index) => {
            const comparablePayload = {};
            if (comparableBytes.has(index))
                comparablePayload.payload_bytes = event.payload_bytes;
            if (comparableShapes.has(index))
                comparablePayload.payload_shape = event.payload_shape;
            return Object.keys(comparablePayload).length === 0
                ? null
                : comparablePayload;
        }))
            .map((stream) => digestCanonicalValue(stream))
            .sort(compareUnicodeCodePoints));
        const identity = `wss_${groupKey}`;
        left.set(identity, project(beforeGroup));
        right.set(identity, project(afterGroup));
    }
    return [left, right];
};
const webMcpDimension = (before, after) => {
    const groups = (discovery) => {
        const result = new Map();
        for (const tool of discovery?.tools.items ?? []) {
            const identity = `webmcp_${digestCanonicalValue({
                name: tool.name,
                frame_url: tool.frame_url,
                owner_origin: tool.owner_origin,
            })}`;
            const tools = result.get(identity) ?? [];
            tools.push(tool);
            result.set(identity, tools);
        }
        return result;
    };
    const previous = groups(before);
    const next = groups(after);
    const beforeComplete = webMcpComplete(before);
    const afterComplete = webMcpComplete(after);
    const inventoryComplete = beforeComplete && afterComplete;
    const left = new Map();
    const right = new Map();
    let valuesComplete = true;
    for (const identity of new Set([...previous.keys(), ...next.keys()])) {
        const beforeTools = previous.get(identity) ?? [];
        const afterTools = next.get(identity) ?? [];
        if (!beforeComplete && !afterComplete) {
            valuesComplete = false;
            continue;
        }
        // Multiple same-name owners at the same URL cannot be paired by frame ID.
        // Keep this uncertainty rather than selecting a duplicate by capture order.
        if (beforeTools.length > 1 || afterTools.length > 1) {
            valuesComplete = false;
            // Complete counts can contradict one another even when individual
            // owners cannot be paired. Do not discard that independent proof.
            if (inventoryComplete ||
                (beforeComplete && afterTools.length > beforeTools.length) ||
                (afterComplete && beforeTools.length > afterTools.length)) {
                if (beforeTools.length > 0)
                    left.set(identity, String(beforeTools.length));
                if (afterTools.length > 0)
                    right.set(identity, String(afterTools.length));
            }
            continue;
        }
        const projection = projectWebMcpTools(beforeTools[0], afterTools[0], beforeComplete, afterComplete);
        if (!projection.complete)
            valuesComplete = false;
        if (projection.before !== undefined)
            left.set(identity, projection.before);
        if (projection.after !== undefined)
            right.set(identity, projection.after);
    }
    return compareDimension(left, right, inventoryComplete && valuesComplete, "WebMCP discovery, owner correspondence, or declaration evidence was unavailable or incomplete in at least one capture.", (identity) => !previous.has(identity)
        ? beforeComplete
        : !next.has(identity)
            ? afterComplete
            : inventoryComplete);
};
/** Compare only declaration facts retained by both captures. */
const projectWebMcpTools = (beforeTool, afterTool, beforeComplete, afterComplete) => {
    let valuesComplete = true;
    const inventoryComplete = beforeComplete && afterComplete;
    const paired = beforeTool !== undefined && afterTool !== undefined;
    const consequentialKnown = beforeTool?.annotations.consequential !== undefined &&
        afterTool?.annotations.consequential !== undefined;
    if (beforeTool !== undefined &&
        afterTool !== undefined &&
        !consequentialKnown)
        valuesComplete = false;
    // A missing stack or malformed coordinate is not a different source.
    // Compare only jointly observed components, but retain unknown coverage.
    const beforeSource = beforeTool?.registration_source;
    const afterSource = afterTool?.registration_source;
    const sourcePresent = beforeSource != null && afterSource != null;
    const bothAbsent = beforeSource === null && afterSource === null && inventoryComplete;
    const sourceKnown = sourcePresent || bothAbsent;
    const lineKnown = sourcePresent && beforeSource.line !== null && afterSource.line !== null;
    const columnKnown = sourcePresent &&
        beforeSource.column !== null &&
        afterSource.column !== null;
    if (paired &&
        (!sourceKnown || (sourcePresent && (!lineKnown || !columnKnown))))
        valuesComplete = false;
    const schemaKnown = !paired ||
        ((beforeComplete || beforeTool.input_schema_sha256 !== null) &&
            (afterComplete || afterTool.input_schema_sha256 !== null));
    const annotationKeys = [
        "read_only",
        "untrusted_content",
        "autosubmit",
    ];
    const knownAnnotations = new Set(annotationKeys.filter((key) => !paired ||
        ((beforeComplete || beforeTool.annotations[key] !== null) &&
            (afterComplete || afterTool.annotations[key] !== null))));
    if (paired &&
        (!schemaKnown || knownAnnotations.size !== annotationKeys.length))
        valuesComplete = false;
    const project = (tool) => {
        const { tool_key: _key, frame_id: _frameId, annotations, registration_source: source, input_schema: schema, input_schema_sha256: schemaDigest, ...content } = tool;
        return digestCanonicalValue({
            ...content,
            ...(schemaKnown
                ? { input_schema: schema, input_schema_sha256: schemaDigest }
                : {}),
            ...(sourceKnown
                ? {
                    registration_source: source === null
                        ? null
                        : {
                            url: source.url,
                            ...(lineKnown ? { line: source.line } : {}),
                            ...(columnKnown ? { column: source.column } : {}),
                        },
                }
                : {}),
            annotations: {
                ...Object.fromEntries(annotationKeys
                    .filter((key) => knownAnnotations.has(key))
                    .map((key) => [key, annotations[key]])),
                ...(consequentialKnown
                    ? { consequential: annotations.consequential }
                    : {}),
            },
        });
    };
    return {
        before: beforeTool === undefined ? undefined : project(beforeTool),
        after: afterTool === undefined ? undefined : project(afterTool),
        complete: valuesComplete,
    };
};
const webMcpComplete = (discovery) => discovery !== null &&
    discovery.status === "available" &&
    discovery.completeness.dropped_events.webmcp_tools === 0 &&
    !incompleteSections(discovery.completeness).has("webmcp_tools");
const sectionsComplete = (inspection, sections) => {
    const incomplete = incompleteSections(inspection.completeness);
    return sections.every((section) => !incomplete.has(section));
};
const incompleteSections = (completeness) => new Set([
    ...completeness.policy_filtered_sections,
    ...completeness.attach_limited_sections,
    ...completeness.truncated_sections,
    ...completeness.unavailable_sections,
]);
/** Whole-collection digest differences cannot prove a change across omissions. */
const compareAggregate = (identity, before, after, complete, reason) => compareDimension(complete ? singleton(identity, digestCanonicalValue(before)) : new Map(), complete ? singleton(identity, digestCanonicalValue(after)) : new Map(), complete, reason);
const domValueLengthsComparable = (before, after) => (before.nodes.length === 0 && after.nodes.length === 0) ||
    (before.node_value_length_unit !== undefined &&
        before.node_value_length_unit === after.node_value_length_unit);
/** Compare parsed node facts without serializing or copying the inventories. */
const domNodesDiffer = (before, after, compareLengths) => before.length !== after.length ||
    before.some((node, index) => {
        const next = after[index];
        return (next === undefined ||
            node.index !== next.index ||
            node.parent_index !== next.parent_index ||
            node.node_type !== next.node_type ||
            node.node_name !== next.node_name ||
            (compareLengths && node.node_value_length !== next.node_value_length) ||
            node.attribute_names.length !== next.attribute_names.length ||
            node.attribute_names.some((name, position) => name !== next.attribute_names[position]));
    });
const domDimension = (before, after) => {
    const beforeFrames = fingerprintWebCaptureFrames(before.frames);
    const afterFrames = fingerprintWebCaptureFrames(after.frames);
    const nodesComplete = [before, after].every((inspection) => sectionsComplete(inspection, ["dom"]) &&
        inspection.dom.total_nodes === inspection.dom.nodes.length);
    const framesComplete = beforeFrames !== null &&
        afterFrames !== null &&
        [before, after].every((inspection) => sectionsComplete(inspection, ["frames"]));
    const changes = [];
    const lengthsComparable = domValueLengthsComparable(before.dom, after.dom);
    if (nodesComplete &&
        domNodesDiffer(before.dom.nodes, after.dom.nodes, lengthsComparable))
        changes.push({ identity: "document", change: "modified" });
    if (framesComplete && beforeFrames !== afterFrames)
        changes.push({ identity: "frames", change: "modified" });
    if (changes.length > 0)
        return {
            status: "changed",
            total_changes: changes.length,
            changes,
            reason: null,
        };
    return nodesComplete && framesComplete && lengthsComparable
        ? { status: "unchanged", total_changes: 0, changes: [], reason: null }
        : {
            status: "unknown",
            total_changes: 0,
            changes: [],
            reason: "DOM or frame capture was incomplete, frame ancestry was unresolved, or DOM value-length units were missing or different in at least one observation.",
        };
};
/** A declaration needs more placements than its exact slots plus every unknown. */
const declarationCountsExceed = (needed, slots) => {
    if (needed.length > slots.length)
        return true;
    let unknown = 0;
    const exact = new Map();
    for (const slot of slots) {
        if (slot.unknown) {
            unknown += 1;
            continue;
        }
        exact.set(slot.declaration, (exact.get(slot.declaration) ?? 0) + 1);
    }
    const required = new Map();
    for (const item of needed)
        required.set(item.declaration, (required.get(item.declaration) ?? 0) + 1);
    let surplus = 0;
    for (const [declaration, count] of required) {
        const available = exact.get(declaration) ?? 0;
        if (count > available + unknown)
            return true;
        if (count > available)
            surplus += count - available;
    }
    return surplus > unknown;
};
const metadataEntries = (metadata) => {
    const record = metadata;
    return Object.keys(record)
        .sort()
        .map((key) => [key, record[key]]);
};
const groupScriptMapFacts = (items, keyFor) => {
    const groups = new Map();
    for (const item of items) {
        const key = keyFor(item);
        const existing = groups.get(key);
        if (existing === undefined)
            groups.set(key, { ...item, count: 1 });
        else
            existing.count += 1;
    }
    return [...groups.values()];
};
/** Every declaration can use every slot, so counts already decide the result. */
const scriptMapMetadataFitsAll = (needed, slots, metadataCompatible) => needed.every((item) => slots.every((slot) => metadataCompatible(item.metadata, slot.metadata)));
/**
 * True when identical groups cannot be placed. Flow moves whole counts, so
 * repeated scripts do not become a dense assignment graph.
 */
const scriptMapGroupAssignmentExceeds = (needed, slots, metadataCompatible) => {
    const residual = slots.map((slot) => slot.count);
    const demand = needed.map((item) => item.count);
    const edges = needed.map((item) => slots.flatMap((slot, index) => metadataCompatible(item.metadata, slot.metadata) &&
        (slot.unknown || slot.declaration === item.declaration)
        ? [index]
        : []));
    const flow = new Map();
    const flowKey = (needIndex, slotIndex) => `${String(needIndex)}:${String(slotIndex)}`;
    const send = (needIndex, seen, cap) => {
        for (const slotIndex of edges[needIndex] ?? []) {
            if (seen.has(slotIndex))
                continue;
            const free = residual[slotIndex] ?? 0;
            if (free <= 0)
                continue;
            seen.add(slotIndex);
            const pushed = Math.min(cap, free);
            residual[slotIndex] = free - pushed;
            flow.set(flowKey(needIndex, slotIndex), (flow.get(flowKey(needIndex, slotIndex)) ?? 0) + pushed);
            return pushed;
        }
        for (const slotIndex of edges[needIndex] ?? []) {
            if (seen.has(slotIndex))
                continue;
            seen.add(slotIndex);
            for (let other = 0; other < needed.length; other += 1) {
                if (other === needIndex)
                    continue;
                const moved = flow.get(flowKey(other, slotIndex)) ?? 0;
                if (moved <= 0)
                    continue;
                const rerouted = send(other, seen, Math.min(cap, moved));
                if (rerouted <= 0)
                    continue;
                flow.set(flowKey(other, slotIndex), moved - rerouted);
                flow.set(flowKey(needIndex, slotIndex), (flow.get(flowKey(needIndex, slotIndex)) ?? 0) + rerouted);
                return rerouted;
            }
        }
        return 0;
    };
    for (let index = 0; index < needed.length; index += 1)
        while ((demand[index] ?? 0) > 0) {
            const pushed = send(index, new Set(), demand[index] ?? 0);
            if (pushed === 0)
                return true;
            demand[index] = (demand[index] ?? 0) - pushed;
        }
    return false;
};
/**
 * True when observed declarations cannot be placed on the other capture.
 * Identical scripts share one count, so repeated declarations are not retried
 * as separate permutations.
 */
const scriptMapFactsExceed = (needed, slots, metadataCompatible) => {
    if (needed.length === 0)
        return false;
    if (declarationCountsExceed(needed, slots))
        return true;
    const needGroups = groupScriptMapFacts(needed, (item) => compositeKey([metadataEntries(item.metadata), item.declaration]));
    const slotGroups = groupScriptMapFacts(slots, (slot) => compositeKey([
        metadataEntries(slot.metadata),
        slot.declaration,
        slot.unknown,
    ]));
    if (scriptMapMetadataFitsAll(needGroups, slotGroups, metadataCompatible))
        return false;
    return scriptMapGroupAssignmentExceeds(needGroups, slotGroups, metadataCompatible);
};
const scriptsDimension = (before, after) => {
    const groups = (inspection) => {
        const result = new Map();
        for (const script of inspection.scripts.items) {
            // Inventory keys include optional metadata. Their spelling cannot prove
            // semantic identity when that metadata is missing in another capture.
            const identity = `scrg_${digestCanonicalValue(script.url)}`;
            const items = result.get(identity) ?? [];
            items.push(script);
            result.set(identity, items);
        }
        return result;
    };
    const previous = groups(before);
    const next = groups(after);
    const beforeComplete = sectionsComplete(before, ["scripts"]) &&
        before.completeness.dropped_events.scripts === 0;
    const afterComplete = sectionsComplete(after, ["scripts"]) &&
        after.completeness.dropped_events.scripts === 0;
    // A null declaration may represent an omitted URL. The capture ledger is
    // section-wide, so it cannot identify which null script was affected.
    // Unavailable map bodies alone do not erase an observed declaration.
    const declarationMayBeOmitted = (inspection) => inspection.completeness.policy_filtered_sections.includes("source_maps") ||
        inspection.completeness.truncated_sections.includes("source_maps") ||
        inspection.completeness.excluded.some((item) => item.section === "source_maps" &&
            item.count !== 0 &&
            [
                "disallowed_origin",
                "unsupported_url",
                "resource_budget_exhausted",
                "invalid_protocol_value",
            ].includes(item.reason));
    const beforeMayOmitDeclaration = declarationMayBeOmitted(before);
    const afterMayOmitDeclaration = declarationMayBeOmitted(after);
    const left = new Map();
    const right = new Map();
    let valuesComplete = true;
    for (const identity of new Set([...previous.keys(), ...next.keys()])) {
        const prior = previous.get(identity) ?? [];
        const later = next.get(identity) ?? [];
        const all = [...prior, ...later];
        const fields = ["cdp_hash", "length", "is_module", "language"].filter((field) => all.every((script) => script[field] !== null));
        const sourceComparable = prior.length > 0 &&
            later.length > 0 &&
            all.every((script) => script.source.included);
        const mapComparable = prior.every((script) => script.source_map_url !== null || !beforeMayOmitDeclaration) &&
            later.every((script) => script.source_map_url !== null || !afterMayOmitDeclaration);
        // Match declarations only within the same fully observed metadata group.
        // An omitted declaration can explain one value in its own group, not a
        // declaration associated with a different observed script hash.
        const metadataFields = [
            "cdp_hash",
            "length",
            "is_module",
            "language",
        ];
        const scriptMetadata = (script) => {
            const metadata = {};
            for (const field of metadataFields) {
                const value = script[field];
                if (value !== null)
                    metadata[field] = value;
            }
            if (sourceComparable && script.source.included)
                metadata.source_sha256 = script.source.artifact.sha256;
            return metadata;
        };
        const metadataCompatible = (left, right) => [...metadataFields, "source_sha256"].every((field) => left[field] === undefined ||
            right[field] === undefined ||
            left[field] === right[field]);
        // Each script keeps the metadata it actually observed. A null field does
        // not erase that field for the rest of the URL group, and an omitted
        // declaration can explain only one compatible script.
        const mapFactsExceed = (observed, observedMayOmit, complete, completeMayOmit) => {
            const needed = observed.flatMap((script) => script.source_map_url === null && observedMayOmit
                ? []
                : [
                    {
                        metadata: scriptMetadata(script),
                        declaration: script.source_map_url,
                    },
                ]);
            const slots = complete.map((script) => ({
                metadata: scriptMetadata(script),
                declaration: script.source_map_url,
                unknown: script.source_map_url === null && completeMayOmit,
            }));
            return scriptMapFactsExceed(needed, slots, metadataCompatible);
        };
        const provenMapDifference = !mapComparable &&
            prior.length > 0 &&
            later.length > 0 &&
            ((afterComplete &&
                mapFactsExceed(prior, beforeMayOmitDeclaration, later, afterMayOmitDeclaration)) ||
                (beforeComplete &&
                    mapFactsExceed(later, afterMayOmitDeclaration, prior, beforeMayOmitDeclaration)));
        if (prior.length > 0 && later.length > 0 && !mapComparable)
            valuesComplete = false;
        if (prior.length > 0 &&
            later.length > 0 &&
            (!fields.includes("length") ||
                !fields.includes("is_module") ||
                !fields.includes("language") ||
                (!sourceComparable &&
                    (!fields.includes("cdp_hash") ||
                        all.some((script) => script.source.included)))))
            valuesComplete = false;
        const project = (items) => items.map((script) => digestCanonicalValue({
            url: script.url,
            ...(mapComparable ? { source_map_url: script.source_map_url } : {}),
            ...Object.fromEntries(fields.map((field) => [field, script[field]])),
            ...(sourceComparable && script.source.included
                ? { source_sha256: script.source.artifact.sha256 }
                : {}),
        }));
        const priorSamples = project(prior);
        const laterSamples = project(later);
        if (!provenMapDifference &&
            !(beforeComplete && afterComplete) &&
            !(beforeComplete && !samplesContained(laterSamples, priorSamples)) &&
            !(afterComplete && !samplesContained(priorSamples, laterSamples)))
            continue;
        if (prior.length > 0)
            left.set(identity, digestCanonicalValue({
                samples: priorSamples.sort(),
                proof: provenMapDifference ? "before" : null,
            }));
        if (later.length > 0)
            right.set(identity, digestCanonicalValue({
                samples: laterSamples.sort(),
                proof: provenMapDifference ? "after" : null,
            }));
    }
    return compareDimension(left, right, beforeComplete && afterComplete && valuesComplete, "Script inventory, source-map declarations, or corresponding source/metadata evidence was incomplete in at least one observation.", true);
};
const metadataProjection = (inspection) => ({
    responses: inspection.metadata.responses
        .map(({ request_id: _requestId, ...response }) => response)
        .map((value) => digestCanonicalValue(value))
        .sort(),
    dom_urls: inspection.metadata.dom_urls
        .map((value) => digestCanonicalValue(value))
        .sort(),
    agent_hints: inspection.metadata.agent_hints
        .map((value) => digestCanonicalValue(value))
        .sort(),
    excluded_dom_urls: inspection.metadata.excluded_dom_urls,
    headers_allowlisted: inspection.metadata.headers_allowlisted,
});
const singleton = (key, value) => new Map([[key, value]]);
const accessibilityComparable = (inspection) => {
    const text = inspection.accessibility.text_capture.status === "included" &&
        inspection.accessibility.text_capture.excluded_fields === 0;
    const { completeness } = inspection;
    const exclusions = completeness.excluded.filter(({ section }) => section === "accessibility");
    const textOnlyPolicyFilter = inspection.accessibility.text_capture.status === "not_approved" &&
        exclusions.length > 0 &&
        exclusions.every(({ reason }) => reason === "not_approved");
    const nodes = [
        completeness.truncated_sections,
        completeness.unavailable_sections,
        completeness.attach_limited_sections,
    ].every((sections) => !sections.includes("accessibility")) &&
        (!completeness.policy_filtered_sections.includes("accessibility") ||
            textOnlyPolicyFilter) &&
        inspection.accessibility.total_nodes ===
            inspection.accessibility.nodes.length;
    const complete = text && nodes;
    return { text, nodes, complete };
};
const accessibilityProjection = (accessibility, other, includeText) => {
    const nodeIndexes = new Map(accessibility.nodes.map((node, index) => [node.node_id, index]));
    return {
        total_nodes: accessibility.total_nodes,
        nodes: accessibility.nodes.map((node, index) => ({
            parent_index: node.parent_id === null
                ? null
                : (nodeIndexes.get(node.parent_id) ?? -1),
            role: node.role === null || other.nodes[index]?.role === null
                ? null
                : node.role,
            ignored: node.ignored,
            states: node.states,
            ...(includeText
                ? { name: node.name, description: node.description }
                : {}),
        })),
    };
};
const storageKeysComparable = (inspection) => sectionsComplete(inspection, ["storage_keys"]);
const storageMap = (storage, includeKeys, includeUsage, fingerprintIdentities) => {
    const map = new Map([
        [
            "storage:summary",
            digestCanonicalValue({
                origin: storage.origin,
                values_redacted: storage.values_redacted,
                ...(includeUsage
                    ? {
                        usage_bytes: storage.usage_bytes,
                        quota_bytes: storage.quota_bytes,
                    }
                    : {}),
            }),
        ],
    ]);
    const add = (kind, keys) => {
        for (const key of keys) {
            map.set(`storage:${kind}:${key}`, digestCanonicalValue(key));
        }
    };
    if (includeKeys) {
        add("local_storage", storage.local_storage_keys);
        add("session_storage", storage.session_storage_keys);
        add("indexed_db", storage.indexed_db_names);
        add("cache", storage.cache_names);
    }
    for (const fingerprint of storage.content_fingerprints) {
        const identity = `${fingerprint.scope}:${fingerprint.identity_sha256}`;
        if (!fingerprintIdentities.has(identity))
            continue;
        map.set(`storage:content:${identity}`, digestCanonicalValue(fingerprint.value_sha256));
    }
    return map;
};
const storageFingerprintIdentities = (before, after) => {
    const beforeComplete = completeStorageFingerprints(before);
    const afterComplete = completeStorageFingerprints(after);
    const bothComplete = before.fingerprints_complete && after.fingerprints_complete;
    const candidates = bothComplete
        ? new Set([...beforeComplete.keys(), ...afterComplete.keys()])
        : new Set([...beforeComplete.keys()].filter((identity) => afterComplete.has(identity)));
    return new Set([...candidates].filter((identity) => {
        const beforeSchema = beforeComplete.get(identity);
        const afterSchema = afterComplete.get(identity);
        if ((beforeSchema ?? afterSchema)?.scope !== "indexed_db_schema")
            return true;
        return (beforeSchema === undefined ||
            afterSchema === undefined ||
            beforeSchema.projection_version === afterSchema.projection_version);
    }));
};
const completeStorageFingerprints = (storage) => new Map(storage.content_fingerprints
    .filter(({ complete }) => complete)
    .map((fingerprint) => [
    `${fingerprint.scope}:${fingerprint.identity_sha256}`,
    fingerprint,
]));
