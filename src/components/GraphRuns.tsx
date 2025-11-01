import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDate, formatPace, formatDistanceKm, formatDuration } from "@/lib/run";
import { useRuns } from "@/contexts/RunsContext";
import { reverseRuns } from "@/lib/run";

export const GraphRuns = () => {
  const { filteredRuns } = useRuns();

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md">
        <h3 className="font-semibold text-lg mb-2">Évolution des dernières runs</h3>
        { filteredRuns.length === 0 ?
          <p className="text-slate-400">Aucune run pour le moment.</p>
          :
          <div className="w-full h-64">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%" className="-ml-[20px]">
                <LineChart data={reverseRuns(filteredRuns)}>
                  <CartesianGrid stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#9ca3af" dy={10} tickFormatter={(v) => formatDate(v)} />
                  <YAxis stroke="#9ca3af" dx={-5} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const run = payload[0].payload;
                        return (
                          <div className="bg-gray-800 p-2 rounded shadow text-sm">
                            <p>{formatDate(String(label))}</p>
                            <p className="text-cyan-400">{formatDistanceKm(run.distance)} · {formatDuration(run.totalSeconds, false)} · {formatPace(run.totalSeconds, run.distance)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="distance"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#22d3ee" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        }
      </div>
  );
}


