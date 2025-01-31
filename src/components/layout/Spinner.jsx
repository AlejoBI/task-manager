import PropTypes from "prop-types";

const Spinner = ({
  size = "8",
  color = "blue-500",
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-8">
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-${color}`}
      ></div>
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  message: PropTypes.string,
};

export default Spinner;
