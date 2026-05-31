import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number | null;    // percentage change, e.g. 12.5 = +12.5%
  trendLabel?: string;
  className?: string;
}

export function StatCard({ title, value, icon, trend, trendLabel, className }: StatCardProps) {
  const trendPositive = trend != null && trend > 0;
  const trendNegative = trend != null && trend < 0;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {trend != null && (
          <div className={cn(
            "mt-1 flex items-center gap-1 text-xs",
            trendPositive && "text-emerald-600 dark:text-emerald-400",
            trendNegative && "text-destructive",
            !trendPositive && !trendNegative && "text-muted-foreground",
          )}>
            {trendPositive && <TrendingUp className="size-3" />}
            {trendNegative && <TrendingDown className="size-3" />}
            {!trendPositive && !trendNegative && <Minus className="size-3" />}
            <span>
              {trendPositive ? "+" : ""}{trend.toFixed(1)}%
              {trendLabel && ` ${trendLabel}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
