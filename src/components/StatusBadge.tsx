'use client';

type Status = 'Pending' | 'In Progress' | 'Completed';

const statusConfig: Record<Status, { color: string; dot: string; label: string }> = {
    Pending: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400', label: 'Pending' },
    'In Progress': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', dot: 'bg-blue-400', label: 'In Progress' },
    Completed: { color: 'bg-green-500/10 text-green-400 border-green-500/30', dot: 'bg-green-400', label: 'Completed' },
};

export default function StatusBadge({ status }: { status: string }) {
    const config = statusConfig[status as Status] ?? statusConfig['Pending'];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${config.dot}`} />
            {config.label}
        </span>
    );
}
