import { Empty, } from "antd"
import { Link } from "react-router-dom"

export const NotFound = () => {
    return (
      <>
        <Empty/>
        <Link to='/'>Home</Link>
        </>
    )
}