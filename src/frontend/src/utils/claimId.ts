export function formatClaimId(reportId: bigint, timestamp?: bigint): string {
  const ms = timestamp ? Number(timestamp / 1_000_000n) : Date.now();
  const d = new Date(ms);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const seq = String(Number(reportId % 10000n)).padStart(4, "0");
  return `ACC-${year}${month}${day}-${seq}`;
}
