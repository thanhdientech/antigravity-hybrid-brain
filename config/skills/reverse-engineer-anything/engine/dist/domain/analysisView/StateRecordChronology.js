/** Own recorded interval facts separately from the explicit ordinal fallback policy. */
export class StateRecordChronology {
    timeline;
    positions;
    constructor(records, timeline) {
        this.timeline = timeline;
        this.positions = new Map(records.map((record, index) => [record.ordinal, index]));
    }
    startMs(record) {
        return this.timeline === "record-order"
            ? this.positions.get(record.ordinal)
            : record.timing.start?.ms;
    }
    endMs(record) {
        return this.timeline === "record-order"
            ? this.positions.get(record.ordinal)
            : record.timing.endMs;
    }
    completedBefore(left, right) {
        const end = this.endMs(left);
        const start = this.startMs(right);
        return end !== undefined && start !== undefined && end <= start;
    }
}
