import { useRouter, withRouter } from "next/router";
import { useAppContext } from "../context/AppContext";
import Err from "./global/Err";
import Loading from "./global/Loading";
import Sidebar from "./global/Sidebar";
import Success from "./global/Success";

function Layout({ children }) {
  const { err, setErr, loading, success, setSuccess } = useAppContext()

  return (
    <div className="h-full p-4">
      {err && <Err err={err} setErr={setErr}/>}
      {success && <Success success={success} setSuccess={setSuccess}/>}
      {loading && <Loading/>}
      <div className="sm:flex space-y-2 sm:space-y-0">
        <Sidebar />
        <div className="pl-5 flex-1 sm:h-[calc(100vh-16px)] overflow-auto scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-thumb-rounded-full pb-7">
          {children}
        </div>
      </div>
    </div>
  );
}

export default withRouter(Layout);
