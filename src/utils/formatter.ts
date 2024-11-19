export function formatBigNumber(value: number, fractions?: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "long",
    minimumFractionDigits: fractions ? fractions : 0,
  });

  return formatter.format(value);
}
