// Format number input with separators as user types
export const formatNumberInput = (value: string, language: "en" | "pt" = "en"): string => {
  // Remove all non-numeric characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '');
  
  // Handle multiple decimal points - keep only the first one
  const parts = cleanValue.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Split by decimal point
  const [integerPart, decimalPart] = parts;
  
  if (!integerPart && !decimalPart) return '';
  if (!integerPart && decimalPart !== undefined) return '0.' + decimalPart;
  
  // Format integer part with thousand separators (use dots for stylized look)
  const separator = ".";
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  
  // Return with or without decimal part
  if (decimalPart !== undefined) {
    return `${formattedInteger},${decimalPart}`; // Use comma for decimal separator
  }
  
  return formattedInteger;
};

// Parse formatted number input back to numeric string
export const parseNumberInput = (formattedValue: string): string => {
  // Remove thousand separators (dots) but keep decimal separator (comma)
  return formattedValue.replace(/\./g, '').replace(/,/g, '.');
};

// Validate if the parsed number is within acceptable range
export const validateAmount = (value: string): { isValid: boolean; numericValue: number } => {
  const cleanValue = parseNumberInput(value);
  const numericValue = parseFloat(cleanValue);
  const isValid = !isNaN(numericValue) && numericValue > 0 && numericValue <= 1000000000;
  
  return { isValid, numericValue };
};

// Format number for display with dot separators (European style)
export const formatDisplayNumber = (value: number, language: "en" | "pt" = "en"): string => {
  if (isNaN(value) || value === null || value === undefined) return '0';
  
  // Handle very large numbers with proper formatting
  if (value >= 1000000000000) { // Trillion+
    const trillions = (value / 1000000000000).toFixed(0);
    return `${new Intl.NumberFormat('de-DE').format(parseFloat(trillions))}.000.000.000.000`;
  } else if (value >= 1000000000) { // Billion+
    const billions = (value / 1000000000).toFixed(0);
    return `${new Intl.NumberFormat('de-DE').format(parseFloat(billions))}.000.000.000`;
  } else if (value >= 1000000) { // Million+
    const millions = (value / 1000000).toFixed(0);
    return `${new Intl.NumberFormat('de-DE').format(parseFloat(millions))}.000.000`;
  } else {
    // Use dot as thousand separator and comma as decimal separator
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: value < 1 ? 6 : 0
    }).format(value);
  }
};

// Format crypto prices with dot separators for stylized display
export const formatCryptoPrice = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) return '$0,00';
  
  // Format with dot thousand separators and comma decimal separator
  const formatted = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 0.01 ? 8 : 6
  }).format(value);
  
  return `$${formatted}`;
};
