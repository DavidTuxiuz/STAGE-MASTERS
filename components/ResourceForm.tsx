type Track = { id: string; name: string };
type Resource = {
  id: string;
  title: string;
  author: string | null;
  institution: string | null;
  track_id: string | null;
  topic: string | null;
  level: string | null;
  format: string | null;
  source: string | null;
  url: string | null;
  file_url: string | null;
  license_status: string | null;
  description: string | null;
  stage_master_use: string | null;
  status: string;
};

export default function ResourceForm({
  action,
  tracks,
  resource,
}: {
  action: (formData: FormData) => void;
  tracks: Track[];
  resource?: Resource;
}) {
  return (
    <form action={action} encType="multipart/form-data" className="space-y-6">
      <Field label="Title" name="title" required defaultValue={resource?.title} />

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Author" name="author" defaultValue={resource?.author ?? ""} />
        <Field label="Institution" name="institution" defaultValue={resource?.institution ?? ""} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[14px] text-slate">Track</label>
          <select
            name="track_id"
            defaultValue={resource?.track_id ?? ""}
            className="w-full border border-rule bg-transparent px-4 py-3 outline-none focus-visible:border-brass"
          >
            <option value="">— None —</option>
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <Field label="Topic" name="topic" defaultValue={resource?.topic ?? ""} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-[14px] text-slate">Level</label>
          <select
            name="level"
            defaultValue={resource?.level ?? ""}
            className="w-full border border-rule bg-transparent px-4 py-3 outline-none focus-visible:border-brass"
          >
            <option value="">— Not set —</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <Field label="Format" name="format" placeholder="article, video, template..." defaultValue={resource?.format ?? ""} />
        <div>
          <label className="mb-2 block text-[14px] text-slate">Status</label>
          <select
            name="status"
            defaultValue={resource?.status ?? "draft"}
            className="w-full border border-rule bg-transparent px-4 py-3 outline-none focus-visible:border-brass"
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Source" name="source" defaultValue={resource?.source ?? ""} />
        <Field label="URL" name="url" type="url" defaultValue={resource?.url ?? ""} placeholder="For a resource that lives elsewhere" />
      </div>

      <div>
        <label htmlFor="file" className="mb-2 block text-[14px] text-slate">
          File
        </label>
        <input
          id="file"
          name="file"
          type="file"
          className="w-full border border-rule bg-transparent px-4 py-3 outline-none file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-paper"
        />
        {resource?.file_url && (
          <p className="mt-2 text-[13px] text-slate">
            Current file:{" "}
            <a href={resource.file_url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              view
            </a>
            . Choosing a new file replaces it.
          </p>
        )}
      </div>

      <Field
        label="License / access status"
        name="license_status"
        placeholder='e.g. "used with permission", "fair use — attribution required"'
        defaultValue={resource?.license_status ?? ""}
      />

      <TextArea label="Description" name="description" defaultValue={resource?.description ?? ""} />
      <TextArea
        label="Why Stage Master uses this"
        name="stage_master_use"
        defaultValue={resource?.stage_master_use ?? ""}
      />

      <button
        type="submit"
        className="bg-ink px-6 py-3.5 text-[15px] font-medium text-paper transition-opacity hover:opacity-80"
      >
        {resource ? "Save changes" : "Create resource"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[14px] text-slate">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full border border-rule bg-transparent px-4 py-3 outline-none focus-visible:border-brass"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[14px] text-slate">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={3}
        defaultValue={defaultValue}
        className="w-full resize-y border border-rule bg-transparent px-4 py-3 outline-none focus-visible:border-brass"
      />
    </div>
  );
}
