'use client';

export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-blue-500 border-b-pink-500 border-l-transparent animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-purple-400 border-b-transparent border-l-blue-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
            </div>
            <p className="text-gray-400 text-sm animate-pulse">{text}</p>
        </div>
    );
}
