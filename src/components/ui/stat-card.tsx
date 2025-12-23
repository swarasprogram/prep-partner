import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statCardVariants = cva(
  "relative overflow-hidden rounded-xl p-6 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card shadow-card hover:shadow-lg",
        gradient: "bg-gradient-card shadow-card hover:shadow-lg",
        glass: "glass-card hover:shadow-lg",
        accent: "bg-accent/10 border border-accent/20 hover:border-accent/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant,
  className,
}: StatCardProps) {
  return (
    <div className={cn(statCardVariants({ variant }), className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.positive ? "text-success" : "text-destructive"
              )}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-accent/10 p-3 text-accent">{icon}</div>
        )}
      </div>
    </div>
  );
}
