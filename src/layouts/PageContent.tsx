import Header from '@layouts/Header';

const PageContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="drawer-content h-dvh flex flex-col" >
            <Header />
            <main className="flex-1 bg-base-200 p-1 md:p-3 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}

export default PageContent;