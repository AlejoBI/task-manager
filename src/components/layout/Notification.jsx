import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

const Notification = ({
  message,
  type = "default",
  position = "top-right",
}) => {
  const showNotification = () => {
    const options = { position };

    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "info":
        toast(message, options);
        break;
      case "warning":
        toast(message, {
          ...options,
          style: { background: "#facc15", color: "#000" },
        });
        break;
      default:
        toast(message, options);
    }
  };

  return (
    <button
      onClick={showNotification}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
    >
      Show Notification
    </button>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info", "warning", "default"]),
  position: PropTypes.oneOf([
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
  ]),
};

export default Notification;
