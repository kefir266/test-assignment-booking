import { randomUUID } from 'crypto';

type GroupedDocuments<T> = Partial<Record<string, T>>;

export function multiplyByExistingData(
  bookings: Booking[],
  claims: Claim[],
  times: number,
): { claims: Claim[]; bookings: Booking[] } {
  const groupedClaims: GroupedDocuments<Claim[]> = Object.groupBy(
    claims,
    ({ patient }) => patient.trim(),
  );
  const groupedBookings: GroupedDocuments<Booking[]> = Object.groupBy(
    bookings,
    ({ patient }) => patient.trim(),
  );
  const newClaims = [] as unknown as Claim[];
  const newBookings = [] as unknown as Booking[];
  const mergedPatients = outerJoin(groupedBookings, groupedClaims);

  for (const pat of mergedPatients) {
    const [curPatient, patientBookings, patientClaims] = pat;

    for (let i = 0; i < times; i++) {
      const newPatient = randomUUID() as string;
      if (patientBookings) {
        newBookings.push(...cloneDomunts(patientBookings, newPatient));
      }
      if (patientClaims) {
        newClaims.push(...cloneDomunts(patientClaims, newPatient));
      }
    }
  }

  return { claims: newClaims, bookings: newBookings };
}

function cloneDomunts<T extends { patient }>(
  documents: T[],
  patient: string,
): T[] {
  return documents.map((doc) => {
    return { ...doc, patient };
  });
}

function outerJoin<T, S>(
  groupsA: GroupedDocuments<T[]>,
  groupsB: GroupedDocuments<S[]>,
): [string, T[], S[]][] {
  const entriesA = Object.entries(groupsA).sort(([key1], [key2]) =>
    key1 > key2 ? 1 : -1,
  );
  const entriesB = Object.entries(groupsB).sort(([key1], [key2]) =>
    key1 > key2 ? 1 : -1,
  );

  const iteratorA = entriesA.values();
  const iteratorB = entriesB.values();
  const merged = [] as unknown as [string, T[], S[]][];
  for (
    let documentAI = iteratorA.next(), documentBI = iteratorB.next();
    !documentAI.done || !documentBI.done;

  ) {
    const [groupA, documentsA] = documentAI.value as [string, T[]];
    const [groupB, documentsB] = documentBI.value as [string, S[]];

    if (groupA === groupB) {
      merged.push([groupA, documentsA || [], documentsB || []]);
      documentAI = iteratorA.next();
      documentBI = iteratorB.next();
    } else {
      if (groupA > groupB) {
        documentBI = iteratorB.next();
      } else {
        documentAI = iteratorA.next();
      }
    }
  }

  return merged;
}
