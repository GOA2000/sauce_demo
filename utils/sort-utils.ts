export class SortUtils {
  /** Returns true if titles are in A→Z order */
  static compareTitlesAsc(titles: string[]): boolean {
    for (let i = 1; i < titles.length; i++) {
      if (titles[i - 1].localeCompare(titles[i]) > 0) {
        return false;
      }
    }
    return true;
  }

  /** Returns true if titles are in Z→A order */
  static compareTitlesDesc(titles: string[]): boolean {
    for (let i = 1; i < titles.length; i++) {
      if (titles[i - 1].localeCompare(titles[i]) < 0) {
        return false;
      }
    }
    return true;
  }

  /** Returns true if prices (e.g. "$15.99") are in low→high order */
  static comparePricesAsc(priceStrings: string[]): boolean {
    const nums = priceStrings.map((str) => parseFloat(str.replace(/[^0-9.-]+/g, '')));
    for (let i = 1; i < nums.length; i++) {
      if (nums[i - 1] > nums[i]) {
        return false;
      }
    }
    return true;
  }

  /** Returns true if prices are in high→low order */
  static comparePricesDesc(priceStrings: string[]): boolean {
    const nums = priceStrings.map((str) => parseFloat(str.replace(/[^0-9.-]+/g, '')));
    for (let i = 1; i < nums.length; i++) {
      if (nums[i - 1] < nums[i]) {
        return false;
      }
    }
    return true;
  }
}
