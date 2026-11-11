
import { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegStar,
} from "react-icons/fa";

const DiaryEntry = ({
  entryId,
  Movie,
  liked: initialLiked,
  rating: initalRating,
  review: initialReview,
  watchedDate: initialWatchedDate,
  onClose,
  onSave,
  onDelete,
}) => {
  const [rating, setRating] = useState(initalRating || 0);
  const [liked, setLiked] = useState(initialLiked || false);
  const [review, setReview] = useState(initialReview || "");
  const [watchedDate, setWatchedDate] = useState(
    initialWatchedDate
      ? initialWatchedDate.slice(0, 10)
      : new Date().toISOString().split("T")[0]
  );

  const handleDeleteEntry = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/diary/${entryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      onDelete(entryId);
    } else {
      const data = await response.json();
      alert(data.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#050507] p-3 sm:p-4">
      <div className="relative my-auto flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#0c0b12] shadow-[0_40px_120px_rgba(0,0,0,0.9)] sm:rounded-[30px]">
        {/* CSS-only atmosphere */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-700/20 blur-[140px]" />

        <div className="pointer-events-none absolute -bottom-48 -right-20 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[150px]" />

        <div className="pointer-events-none absolute left-[45%] top-[35%] h-[300px] w-[300px] rounded-full bg-fuchsia-500/[0.06] blur-[120px]" />

        {/* Subtle gradient surface */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.035),transparent_35%,rgba(124,58,237,0.04))]" />

        {/* Decorative border */}
        <div className="pointer-events-none absolute inset-2 rounded-xl border border-white/[0.035] sm:inset-3 sm:rounded-[26px]" />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close diary entry"
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center text-3xl font-light leading-none text-white/50 transition duration-200 hover:scale-110 hover:text-white sm:right-5 sm:top-4 sm:text-4xl"
        >
          ×
        </button>

        {/* Main */}
        <div className="relative flex flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10 md:flex-row md:items-center md:gap-0 md:px-12">
          {/* Poster */}
          <div className="relative mx-auto w-32 shrink-0 sm:w-44 md:mx-0 md:w-[240px] lg:w-[285px]">
            {/* Purple poster glow */}
            <div className="absolute -inset-5 rounded-[28px] bg-purple-600/20 blur-[35px]" />

            {/* Blue secondary glow */}
            <div className="absolute -bottom-8 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[45px]" />

            <div className="relative overflow-hidden rounded-[18px] border border-white/[0.14] bg-black p-1 shadow-[0_30px_70px_rgba(0,0,0,0.75)]">
              <img
                src={`https://image.tmdb.org/t/p/w500${Movie.poster_path}`}
                alt={Movie.title}
                className="aspect-[2/3] w-full rounded-[14px] object-cover"
              />

              {/* Poster color overlay */}
              <div className="pointer-events-none absolute inset-1 rounded-[14px] bg-gradient-to-tr from-purple-950/20 via-transparent to-white/[0.08]" />
            </div>
          </div>

          {/* Right side */}
          <div className="flex min-w-0 flex-1 flex-col md:ml-10 lg:ml-14">
            {/* Title */}
            <div className="flex items-start gap-2 pr-10 sm:pr-12">
              <h1 className="min-w-0 break-words text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl lg:text-4xl">
                {Movie.title}
              </h1>

              <span className="shrink-0 pt-1 text-sm font-medium text-white/35 sm:text-lg">
                {Movie.release_date?.slice(0, 4)}
              </span>
            </div>

            {/* Accent line */}
            <div className="mt-4 h-[2px] w-20 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-transparent sm:mt-5" />

            {/* Like + Rating */}
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-7">
              {/* Like */}
              <button
                type="button"
                aria-label={liked ? "Unlike film" : "Like film"}
                onClick={() => setLiked((prev) => !prev)}
                className={`flex h-10 w-10 shrink-0 items-center justify-center transition duration-300 hover:scale-110 sm:h-11 sm:w-11 ${
                  liked
                    ? "text-red-400 drop-shadow-[0_0_14px_rgba(236,72,153,0.45)]"
                    : "text-white/30 hover:text-white/70"
                }`}
              >
                {liked ? (
                  <FaHeart className="h-7 w-7 sm:h-8 sm:w-8" />
                ) : (
                  <FaRegHeart className="h-7 w-7 sm:h-8 sm:w-8" />
                )}
              </button>

              {/* Rating */}
              <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="relative flex h-8 w-7 items-center justify-center sm:h-11 sm:w-11"
                  >
                    {/* Empty star */}
                    <FaRegStar className="absolute h-6 w-6 text-white/15 sm:h-9 sm:w-9" />

                    {/* Full star */}
                    {rating >= star && (
                      <FaStar className="absolute h-6 w-6 text-amber-400 drop-shadow-[0_0_7px_rgba(251,191,36,0.35)] sm:h-9 sm:w-9" />
                    )}

                    {/* Half star */}
                    {rating === star - 0.5 && (
                      <div className="absolute left-1/2 top-1/2 h-6 w-3 -translate-x-full -translate-y-1/2 overflow-hidden sm:h-9 sm:w-[18px]">
                        <FaStar className="h-6 w-6 max-w-none text-amber-400 drop-shadow-[0_0_7px_rgba(251,191,36,0.35)] sm:h-9 sm:w-9" />
                      </div>
                    )}

                    {/* Left half */}
                    <button
                      type="button"
                      aria-label={`Rate ${star - 0.5} stars`}
                      onClick={() => setRating(star - 0.5)}
                      className="absolute left-0 top-0 h-full w-1/2"
                    />

                    {/* Right half */}
                    <button
                      type="button"
                      aria-label={`Rate ${star} stars`}
                      onClick={() => setRating(star)}
                      className="absolute right-0 top-0 h-full w-1/2"
                    />
                  </div>
                ))}

                {/* Remove rating */}
                {rating > 0 && (
                  <button
                    type="button"
                    aria-label="Remove rating"
                    onClick={() => setRating(0)}
                    className="ml-1 text-2xl font-light leading-none text-white/30 transition hover:text-white sm:ml-2 sm:text-3xl"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Watched date */}
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-5">
              <label
                htmlFor="watched-date"
                className="text-xs font-medium uppercase tracking-[0.15em] text-white/45 sm:text-sm sm:tracking-[0.2em]"
              >
                Watched on
              </label>

              <input
                id="watched-date"
                type="date"
                value={watchedDate}
                onChange={(e) => setWatchedDate(e.target.value)}
                className="min-w-0 max-w-full rounded-xl border border-white/10 bg-white/[0.045] px-2 py-2 text-sm font-medium text-white/70 outline-none transition duration-200 hover:border-white/20 hover:bg-white/[0.07] focus:border-purple-400/50 focus:text-white sm:text-base"
              />
            </div>

            {/* Review */}
            <div className="relative mt-6 sm:mt-7">
              <div className="absolute -left-3 top-0 h-full w-[2px] rounded-full bg-gradient-to-b from-purple-500 via-fuchsia-500/40 to-transparent" />

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review..."
                className="h-36 w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-base leading-7 text-white outline-none backdrop-blur-md transition duration-300 placeholder:text-white/20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:border-purple-400/35 focus:bg-white/[0.04] sm:h-44 sm:text-lg sm:leading-8"
              />
            </div>

            {/* Save and delete */}
            <div className="mt-5 flex justify-end gap-3 sm:mt-6">
              <button
                type="button"
                className="rounded-full border border-red-400/20 px-4 py-3 text-xs font-semibold text-red-400 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300 sm:px-6 sm:py-3.5 sm:text-sm"
                onClick={handleDeleteEntry}
              >
                DELETE
              </button>

              <button
                type="button"
                className="relative overflow-hidden rounded-full bg-gradient-to-r from-white via-white to-purple-100 px-6 py-3 text-xs font-bold text-black shadow-[0_8px_30px_rgba(255,255,255,0.08)] transition duration-300 hover:scale-[1.04] hover:shadow-[0_8px_35px_rgba(168,85,247,0.25)] active:scale-[0.97] sm:px-8 sm:py-3.5 sm:text-sm"
                onClick={() => {
                  onSave(watchedDate, rating, liked, review);
                }}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryEntry;
