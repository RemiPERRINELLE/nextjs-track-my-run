import { StatsLastRunCard } from "./StatsLastRunCard";
import { StatsDistanceCard } from "./StatsDistanceCard";
import { StatsDurationCard } from "./StatsDurationCard";
import { StatsPaceCard } from "./StatsPaceCard";

export const StatsGrid = () => {

  return (
        <div className="grid grid-cols-1 xl:grid-cols-4 sm:grid-cols-2 gap-6">
            <StatsLastRunCard />

            <StatsDistanceCard />

            <StatsDurationCard />

            <StatsPaceCard />
        </div>
    );
}


