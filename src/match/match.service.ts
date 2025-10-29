import { Injectable } from '@nestjs/common';
import testMap from './test-map.json';

type Groped<T> = [string, T[]];
type Match = { claim: string; booking: string; mismatch: string[] };
const BOOKING_DATE = 'reservationDate';
const CLAIM_DATE = 'bookingDate';

@Injectable()
export class MatchService {
  #testMap: Map<string, string> = new Map(
    testMap.map((pair) => [pair.bookingTestId, pair.claimTestId]),
  );

  /**
   * Matches bookings and claims lists, returning an array of matches with mismatched fields.
   *
   * @param bookings - Array of Booking objects to be matched.
   * @param claims - Array of Claim objects to be matched.
   * @returns Array of Match objects containing matched booking and claim IDs along with mismatched fields.
   */
  matchLists(bookings: Booking[], claims: Claim[]): Match[] {
    if (!bookings.length || !claims.length) {
      return [];
    }

    const groupedBookingsByPatient: Groped<Booking>[] =
      this.#groupAndSort(bookings);

    const groupedClaimsByPatient: Groped<Claim>[] = this.#groupAndSort(claims);

    let bookingsInd = 0;
    let claimsInd = 0;
    const matchesWithMismatchedFields: Match[] = [];

    // Iterate through both grouped lists to find matches by patient
    do {
      const [bookingPatient, bookings] = groupedBookingsByPatient[bookingsInd];
      const [claimPatient, claims] = groupedClaimsByPatient[claimsInd];
      if (bookingPatient === claimPatient) {
        //sort documents only if we have the same patient to awoid extra sorting
        const sortedBookings = this.#sortDocuments(bookings, BOOKING_DATE);
        const sortedClaims = this.#sortDocuments(claims, CLAIM_DATE);

        const mismatches = this.#matchDocuments(sortedBookings, sortedClaims);
        matchesWithMismatchedFields.push(...mismatches);
        bookingsInd++;
        claimsInd++;
      } else if (bookingPatient > claimPatient) {
        claimsInd++;
      } else {
        bookingsInd++;
      }
    } while (bookingsInd < bookings.length && claimsInd < claims.length);

    return matchesWithMismatchedFields;
  }

  /**
   * Sorts documents by a specified field.
   *
   * @param documents
   * @param field
   * @returns
   */
  #sortDocuments<T>(documents: T[], field: string) {
    return documents.sort((docA, docB) => (docA[field] > docB[field] ? 1 : -1));
  }

  #isTheSameDay(date1: string, date2: string): boolean {
    // supose all date in one TZ
    // take just the substring with date
    return date1.substring(0, 10) === date2.substring(0, 10);
  }

  /**
   * Matches documents from bookings and claims based on the the same date.
   * assumes both lists are sorted by date.
   *
   * @param bookings Array of Booking objects.
   * @param claims Array of Claim objects.
   * @returns
   */
  #matchDocuments(bookings: Booking[], claims: Claim[]): Match[] {
    let indB = 0;
    let indC = 0;
    const matchedDocuments: Match[] = [] as Match[];
    let mismatch: string[];

    // As the lists are sorted come through both arrays in one pass with two indices
    do {
      if (
        this.#isTheSameDay(
          bookings[indB][BOOKING_DATE],
          claims[indC][CLAIM_DATE],
        )
      ) {
        mismatch = this.#getMismatch(bookings[indB], claims[indC]);
        matchedDocuments.push({
          claim: claims[indC].id,
          booking: bookings[indB].id,
          mismatch,
        });
        indB++;
        indC++;
      } else if (bookings[indB][BOOKING_DATE] > claims[indC][CLAIM_DATE]) {
        indC++;
      } else {
        indB++;
      }
    } while (indB < bookings.length && indC < claims.length);

    return matchedDocuments;
  }

  /**
   * Determines the mismatched fields between a booking and a claim.
   *
   * @param booking
   * @param claim
   * @returns Array of mismatched field names.
   */
  #getMismatch(booking: Booking, claim: Claim): string[] {
    const mismatch: string[] = [];
    const claimTestId = this.#testMap.get(booking.test);
    if (!claimTestId || claimTestId !== claim.medicalServiceCode) {
      mismatch.push('test');
    }

    if (booking[BOOKING_DATE] !== claim[CLAIM_DATE]) {
      mismatch.push('time');
    }

    return mismatch;
  }

  /**
   * Groups and sorts a list of documents by patient.
   *
   * @param list List of documents - Bookings or Claims
   * @returns Grouped documents by Patient
   */
  #groupAndSort<T extends { patient: string }>(list: T[]): Groped<T>[] {
    const groupedByPatient: Partial<Record<string, T[]>> = Object.groupBy(
      list,
      ({ patient }) => patient.trim(),
    );

    return (Object.entries(groupedByPatient) as Groped<T>[]).sort(
      ([patientA], [patientB]) => (patientA > patientB ? 1 : -1),
    );
  }
}
