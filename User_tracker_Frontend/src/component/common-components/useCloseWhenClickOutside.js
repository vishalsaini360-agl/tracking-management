import { useEffect } from "react"

export const useCloseWhenClickOutside = (
    toggleState,
    setToggleState,
    refName
)=>{
    useEffect(()=>{
        const IfClickedOutside = (e)=>{
            toggleState && refName.current && !refName.current.contains(e.target) && refName.current.children && setToggleState(false)
        }
        document.addEventListener("mousedown",IfClickedOutside)
        return()=>{
            document.removeEventListener("mousedown",IfClickedOutside)
        }
    },[toggleState])
}