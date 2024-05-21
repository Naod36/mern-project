import { useEffect } from "react";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
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
      toast.success("You have been assigned a new case!");
      // Handle the assigned case update if necessary
      // For example, you can fetch the updated cases or update the state
    });

    return () => {
      socket.off("caseAssigned");
    };
  }, [currentUser]);

  return <ToastContainer />;
}
