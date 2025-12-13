type SvgIconProps = {
  id: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function SvgIcon({ id, width = 24, height = 24, className }: SvgIconProps) {
  return (
    <svg width={width} height={height} className={className}>
      <use xlinkHref={`/icons.svg#${id}`} />
    </svg>
  );
}
