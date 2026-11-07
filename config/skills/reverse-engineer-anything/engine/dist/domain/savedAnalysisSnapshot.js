/** Attach publication facts without discarding a cleanup producer's own observation. */
export const retainSavedAnalysisSnapshot = (error, receipt) => {
    error.partialObservation = {
        saved_snapshot: Object.freeze({ ...receipt }),
        ...(error.partialObservation === undefined
            ? {}
            : { cleanup_observation: error.partialObservation }),
    };
    return error;
};
