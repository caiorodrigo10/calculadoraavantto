export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

export const formatPhoneNumber = (value: string) => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Format as (XX) XXXXX-XXXX
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{2})/, '($1) ')
      .replace(/(\d{5})/, '$1-')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
  
  return numbers.slice(0, 11)
    .replace(/(\d{2})/, '($1) ')
    .replace(/(\d{5})/, '$1-')
    .replace(/(-\d{4})\d+?$/, '$1');
};