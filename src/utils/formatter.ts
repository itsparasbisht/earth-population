export function formatBigNumber(
  value: number,
  fractions?: number,
  display?: "short" | "long"
) {
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: display ? display : "long",
    minimumFractionDigits: fractions ? fractions : 0,
  });

  return formatter.format(value);
}
