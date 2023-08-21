import clsx from "clsx";

export default function Stars({
  percentage,
  text,
}: {
  percentage: number;
  text: boolean;
}) {
  const adjustedPercentage = Math.min(100, Math.max(percentage, 0));
  return (
    <div className="flex justify-center items-center gap-4 relative">
      <div className="relative">
        <div
          className="text-yellow-300 p-0 absolute z-10 flex top-0 left-0 overflow-hidden"
          style={{ width: `${adjustedPercentage}%` }}
        >
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
        <div className="p-0 z-0 flex text-gray-300">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
      </div>
      <span className="text-gray-400">{adjustedPercentage*5/100} out of 5</span>
    </div>
  );
}
