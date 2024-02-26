export default function ModalWrapper({children}: {children: React.ReactNode}) {
    return (
        <div className=" bg-black/30 h-svh w-svw items-center justify-center flex">
            {children}
        </div>
    )

}