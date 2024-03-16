import "./style.css"

export default function ModalWrapper({children}: {children: React.ReactNode}) {
    return (
        <div className="gb-tr h-svh w-svw items-center justify-center flex absolute z-20">
            {children}
        </div>
    )

}