export const formatNumber = (input?: number, decimalCount = 2): string => {
  if (input === undefined || isNaN(Number(input))) return ''

  const value: string = Number(input).toFixed(decimalCount)
  const [integerPart, decimalPart] = value.split('.')
  const integerFormatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return decimalPart ? `${integerFormatted}.${decimalPart}` : `${integerFormatted}.00`
}