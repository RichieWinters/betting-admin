export const formatLocalizedDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = 'ru-RU';
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const formattedDate = new Intl.DateTimeFormat(locale, dateOptions).format(dateObj);
  const formattedTime = new Intl.DateTimeFormat(locale, timeOptions).format(dateObj);

  return `${formattedDate}, ${formattedTime}`;
};
