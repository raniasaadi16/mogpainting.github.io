import { withRouter } from "next/router";
import { useAppContext } from "../context/AppContext";
import Err from "./global/Err";
import Loading from "./global/Loading";
import Success from "./global/Success";

function NoAuthLayout({ children }) {
  const { err, setErr, loading, success, setSuccess } = useAppContext()

  return (
    <div className="h-full">
      {err && <Err err={err} setErr={setErr}/>}
      {success && <Success success={success} setSuccess={setSuccess}/>}
      {loading && <Loading/>}
        {children}
    </div>
  );
}

export default withRouter(NoAuthLayout);
