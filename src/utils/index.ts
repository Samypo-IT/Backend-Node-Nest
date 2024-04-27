import { HttpException } from '@nestjs/common';

export const parseDate = (dateString: string): Date | null => {
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month in JavaScript is zero-based
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return null;
};

interface DataItem {
  state_abbr: string;
  city: string;
  product: string;
  max_date: string;
}

export const findMinMaxDates = (
  data: DataItem[],
): { smallestDate: string | null; largestDate: string | null } => {
  if (data.length === 0) {
    return { smallestDate: null, largestDate: null };
  }

  let smallestDate: DataItem | null = null;
  let largestDate: DataItem | null = null;

  for (const item of data) {
    const date = parseDate(item.max_date);

    if (!date) {
      continue;
    }

    if (!smallestDate || date < parseDate(smallestDate.max_date)) {
      smallestDate = item;
    }

    if (!largestDate || date > parseDate(largestDate.max_date)) {
      largestDate = item;
    }
  }

  return {
    smallestDate: smallestDate ? smallestDate.max_date : null,
    largestDate: largestDate ? largestDate.max_date : null,
  };
};

export const errorReturn = () => {
  throw new HttpException('Informação não localizada', 404);
};
