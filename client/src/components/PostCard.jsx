import { Link } from "react-router-dom";
export default function PostCard({ caseTemplate }) {
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[280px] overflow-hidden rounded-lg sm:w-[350px]">
      <Link to={`/case-page/${caseTemplate.slug}`}>
        <img
          src={caseTemplate.image}
          alt="post cover"
          className="h-[200px] w-full object-cover group-hover:h-[150px] translate-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2 ">
        <p className="text-lg font-semibold line-clamp-2">
          {caseTemplate.title}
        </p>
        <span className="italic text-sm">{caseTemplate.category}</span>
        <Link
          to={`/case-page/${caseTemplate.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white duration-300 py-2 text-center rounded-md !rounded-tl-none m-2"
        >
          View Case
        </Link>
      </div>
    </div>
  );
}
