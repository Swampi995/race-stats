import * as storage from './';

export async function storePastRun(pastRun: storage.PastRunsProps) {
  const pastRuns = await storage.retrieveData<storage.PastRunsObject>(storage.PAST_RUNS);
  let updatedRuns: storage.PastRunsObject;
  if (!pastRuns) {
    updatedRuns = {}
  } else {
    updatedRuns = { ...pastRuns }
    updatedRuns[new Date().getTime()] = pastRun;
  }

  if (Object.keys(updatedRuns).length > 10) {
    const keys = Object.keys(updatedRuns).map((key) => parseInt(key, 10));
    const oldestKey = Math.min(...keys);
    delete updatedRuns[oldestKey];
  }

  await storage.storeData(storage.PAST_RUNS, updatedRuns);
}

export async function getPastRuns() {
  return storage.retrieveData<storage.PastRunsObject>(storage.PAST_RUNS);
}
