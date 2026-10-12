type Track = {
  id: string;
  index: number;
  name: string;
  description: string;
};

export default function TrackForm({
  action,
  track,
}: {
  action: (formData: FormData) => void;
  track?: Track;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[100px_1fr]">
        <div>
          <label htmlFor="index" className="mb-2 block text-[14px] text-slate">
            Index
          </label>
          <input
            id="index"
            name="index"
            type="number"
            required
            min={1}
            defaultValue={track?.index}
            className="w-full border border-rule bg-transparent px-4 py-3 outline-none focus-visible:border-brass"
          />
        </div>
        <div>
          <label htmlFor="name" className="mb-2 block text-[14px] text-slate">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={track?.name}
            className="w-full border border-rule bg-transparent px-4 py-3 outline-none focus-visible:border-brass"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-[14px] text-slate">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={track?.description}
          className="w-full resize-y border border-rule bg-transparent px-4 py-3 outline-none focus-visible:border-brass"
        />
      </div>

      <button
        type="submit"
        className="bg-ink px-6 py-3.5 text-[15px] font-medium text-paper transition-opacity hover:opacity-80"
      >
        {track ? "Save changes" : "Create track"}
      </button>
    </form>
  );
}
