interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer = ({
  title,
  description,
  children,
  className = "",
}: ChartContainerProps) => {
  return (
    <div className={`chart-container ${className}`}>
      <h2 className="chart-title">{title}</h2>
      {description && <p className="chart-subtitle">{description}</p>}
      <div className="chart-wrapper">{children}</div>
    </div>
  );
};
