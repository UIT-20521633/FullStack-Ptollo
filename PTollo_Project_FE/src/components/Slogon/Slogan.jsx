import { useNavigate } from "react-router-dom";

const Slogan = () => {
  const navigate = useNavigate();
  return (
    <section className="mt-26 text-20 my-14 font-bold ">
      <div className="text-center">
        <div className="">
          <img
            src="icons/icon.png"
            alt="PTollo Logo"
            className="mx-auto w-40 h-auto my-9 ml-4"
          />
        </div>
        <p className="">
          PTollo lets you work{" "}
          <span className="text-cyan-300">more collaboratively</span> and get{" "}
          <span className="text-cyan-300">more done</span>.
        </p>
        <p className=" mt-2 text-14 my-8 font-mono leading-relaxed ">
          PTollo&apos;s boards, lists, and cards enable you to organize and
          prioritize your projects in a fun, flexible, and rewarding way.
        </p>
        <button
          onClick={() => {
            navigate("/signup");
          }}
          className="mt-1 px-4 py-3 bg-white/50 text-white text-12 font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-md">
          SIGN UP FOR FREE
        </button>
      </div>
    </section>
  );
};

export default Slogan;
