interface ResponsiveCardGridProps {
    children: React.ReactNode
}

const ResponsiveCardGrid = ({ children }: ResponsiveCardGridProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {children}
        </div>
    );
}
export default ResponsiveCardGrid;