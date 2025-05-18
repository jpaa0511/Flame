
export default function Logo({ width = 120, height = 40 }: { width?: number; height?: number }) {
  return (
    <div className="relative" style={{ width, height }}>
      <div className="text-[#FE3C72] font-bold text-2xl">Flame</div>
    </div>
  );
} 