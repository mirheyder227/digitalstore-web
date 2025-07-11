import { Link } from "react-router-dom";

const Advertising = ({ img, title, text, link }) => {
  return (
    <Link
      to={link}
      className="group w-full flex flex-row md:flex-col items-center gap-4 md:w-64 p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
    >
      <img
        src={img}
        alt={title || "Feature Image"}
        className="w-16 h-16 object-contain rounded"
      />

      <div className="text-center md:text-left">
        <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">
          {title || "No Title"}
        </h4>
        <p className="text-base text-gray-600 mt-1">
          {text || "No Description Available"}
        </p>
      </div>
    </Link>
  );
};

export default Advertising;
