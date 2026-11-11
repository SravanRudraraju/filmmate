
import React from "react";
import { useState, useEffect } from "react";
import { FaRegEdit, FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import DiaryEntry from "../components/DiaryEntry";

const Diary = ({ refreshTrigger }) => {
  const [diary, setDiary] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/diary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setDiary(data.diary);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching diary:", error);
        alert("Something went wrong. Please try again.");
      }
    };

    fetchDiary();
  }, [refreshTrigger]);

  const handleEditDiary = async (watchedDate, rating, liked, review) => {
    const token = localStorage.getItem("token");

    const updatedData = {
      watched_on: watchedDate,
      rating: rating || null,
      liked,
      review,
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/diary/${editingEntry.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    setDiary((prev) =>
      prev.map((entry) =>
        entry.id === editingEntry.id
          ? { ...entry, ...updatedData }
          : entry
      )
    );

    setEditingEntry(null);
  };

  const handleDeleteEntry = (entryId) => {
    setDiary((prev) => prev.filter((entry) => entry.id !== entryId));
    setEditingEntry(null);
  };

  return (
    <div className="mx-auto mt-6 w-full max-w-7xl px-4 sm:mt-8 sm:px-6 lg:px-8">
      {diary.map((entry) => {
        const date = new Date(entry.watched_on);
        const rating = Number(entry.rating) || 0;

        return (
          <div
            key={entry.id}
            className="group flex min-w-0 flex-col gap-4 border-b border-white/[0.08] py-5 sm:py-6 lg:min-h-[145px] lg:flex-row lg:items-center lg:gap-0"
          >
            {/* Date + poster */}
            <div className="flex shrink-0 items-center gap-4 lg:w-auto">
              {/* Watched on */}
              <div className="w-16 shrink-0 sm:w-20 lg:w-28">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/45 sm:text-sm sm:tracking-[0.18em]">
                  {date.toLocaleString("en-US", { month: "short" })}
                </p>

                <p className="mt-1 text-3xl font-semibold leading-none text-white sm:text-4xl">
                  {date.getDate()}
                </p>

                <p className="mt-1 text-sm text-white/40">
                  {date.getFullYear()}
                </p>
              </div>

              {/* Poster */}
              <img
                src={`https://image.tmdb.org/t/p/w200${entry.poster_path}`}
                alt={entry.title}
                loading="lazy"
                className="h-[90px] w-[60px] shrink-0 rounded-md object-cover shadow-lg"
              />

              {/* Title on mobile and tablet */}
              <div className="min-w-0 flex-1 lg:hidden">
                <h2 className="break-words text-lg font-semibold tracking-tight text-white sm:text-xl">
                  {entry.title}
                </h2>

                {entry.release_date && (
                  <span className="mt-1 block text-sm text-white/45">
                    {entry.release_date.slice(0, 4)}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5 lg:ml-7 lg:flex-row lg:items-center lg:gap-7">
              {/* Title + year: desktop */}
              <div className="hidden shrink-0 items-baseline gap-2 lg:flex">
                <h2 className="max-w-[240px] break-words text-xl font-semibold tracking-tight text-white xl:text-2xl">
                  {entry.title}
                </h2>

                {entry.release_date && (
                  <span className="text-base text-white/45">
                    {entry.release_date.slice(0, 4)}
                  </span>
                )}
              </div>

              {/* Review */}
              {entry.review && (
                <div className="min-w-0 flex-1">
                  <p className="whitespace-pre-wrap break-words text-base leading-6 text-white/75 sm:text-lg sm:leading-7">
                    {entry.review}
                  </p>
                </div>
              )}

              {/* Rating + actions */}
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-4 sm:justify-start lg:shrink-0 lg:flex-nowrap lg:gap-3 xl:gap-5">
                {/* Rating */}
                <div className="flex shrink-0 items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const full = rating >= star;
                    const half = rating === star - 0.5;

                    return (
                      <div key={star} className="relative h-5 w-5 sm:h-6 sm:w-6">
                        {/* Empty star */}
                        <FaRegStar className="absolute h-5 w-5 text-white/20 sm:h-6 sm:w-6" />

                        {/* Full star */}
                        {full && (
                          <FaStar className="absolute h-5 w-5 text-amber-400 sm:h-6 sm:w-6" />
                        )}

                        {/* Half star */}
                        {half && (
                          <div className="absolute left-0 top-0 h-5 w-2.5 overflow-hidden sm:h-6 sm:w-3">
                            <FaStar className="h-5 w-5 text-amber-400 sm:h-6 sm:w-6" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Like */}
                <div className="flex shrink-0 items-center">
                  {entry.liked ? (
                    <FaHeart className="h-5 w-5 text-red-400 sm:h-6 sm:w-6" />
                  ) : (
                    <FaRegStar className="hidden" />
                  )}
                </div>

                {/* Edit */}
                <button
                  type="button"
                  title="Edit diary entry"
                  aria-label={`Edit diary entry for ${entry.title}`}
                  onClick={() => setEditingEntry(entry)}
                  className="shrink-0 rounded-lg p-2 text-white/50 transition duration-200 hover:bg-white/[0.08] hover:text-white"
                >
                  <FaRegEdit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {editingEntry && (
        <DiaryEntry
          entryId={editingEntry.id}
          Movie={{
            id: editingEntry.tmdb_movie_id,
            title: editingEntry.title,
            poster_path: editingEntry.poster_path,
            release_date: editingEntry.release_date,
          }}
          rating={Number(editingEntry.rating) || 0}
          liked={editingEntry.liked}
          review={editingEntry.review || ""}
          watchedDate={editingEntry.watched_on}
          onClose={() => setEditingEntry(null)}
          onSave={handleEditDiary}
          onDelete={handleDeleteEntry}
        />
      )}
    </div>
  );
};

export default Diary;
