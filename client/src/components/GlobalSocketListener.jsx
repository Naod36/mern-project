import { useEffect } from "react";
import io from "socket.io-client";
import { toast, ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const socket = io("http://localhost:3000");

export default function GlobalSocketListener() {
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    // Join the user's room
    socket.emit("joinRoom", currentUser._id);

    // Listen for case assignments
    socket.on("caseAssigned", (assignedCase) => {
      toast.info("CCFS: Case Assighned.", {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
      // Handle the assigned case update if necessary
      // For example, you can fetch the updated cases or update the state
    });

    return () => {
      socket.off("caseAssigned");
    };
  }, [currentUser]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={15000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Flip}
    />
  );
}
