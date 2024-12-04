

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// values needed to format a file size value into a readable string
const FILE_SIZE_THRESHOLD: number = 1024;
const FILE_SIZE_UNITS: string[] = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Formats a numeric value based on the user's default language.
 * @param value
 * @param decimalPlaces?
 * @param prefix?
 * @param suffix?
 * @returns string
 */
const prettifyNumber = (
  value: number,
  decimalPlaces: number = 2,
  prefix?: string,
  suffix?: string,
): string => {
  const prettifiedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
  return `${prefix ?? ''}${prettifiedValue}${suffix ?? ''}`;
};

/**
 * Formats a bytes value into a human readable format.
 * @param value
 * @param decimalPlaces
 * @return string
 */
const prettifyFileSize = (value: number, decimalPlaces: number = 2): string => {
  if (typeof value === 'number' && value > 0) {
    let bytes = value;

    // if the value is tiny, return it in bytes
    if (Math.abs(value) < FILE_SIZE_THRESHOLD) {
      return `${value} B`;
    }

    // iterate until the best unit of measure is found
    let u = -1;
    const r = 10 ** decimalPlaces;
    do {
      bytes /= FILE_SIZE_THRESHOLD;
      u += 1;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= FILE_SIZE_THRESHOLD && u < FILE_SIZE_UNITS.length - 1
    );

    // finally, return the value and its unit
    return `${bytes.toFixed(decimalPlaces)} ${FILE_SIZE_UNITS[u]}`;
  }
  return '0 B';
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  prettifyNumber,
  prettifyFileSize,
};
