export default function NotFoundPage() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p>Page not found</p>
    </div>
  );
}

{
  /* <td>
                    <select
                      className={`select  ${
                        req.status === "Completed"
                          ? " text-green-500 select-success"
                          : req.status === "Cancelled" &&
                            "select-error  text-red-500 "
                      }`}
                      value={req.status || ""}
                      onChange={(e) => updateStatus(req.id, e.target.value)}
                    >
                      <option value="" className="text-black">
                        Pending
                      </option>
                      <option value="Completed" className="text-green-500 ">
                        Completed
                      </option>
                      <option value="Cancelled" className="text-red-500">
                        Cancelled
                      </option>
                    </select>
                  </td> */
}
