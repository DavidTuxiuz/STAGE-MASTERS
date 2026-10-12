type Project = { id: string; name: string };
type Showcase = {
  id: string;
  title: string;
  project_id: string | null;
  description: string | null;
  media_url: string | null;
  status: string;
};

export default function ShowcaseForm({
  action,
  projects,
  showcase,
}: {
  action: (formData: FormData) => void;
  projects: Project[];
  showcase?: Showcase;
}) {
  return (
    <form action={action} className="space-y-6">
      <Field label="Title" name="title" required defaultValue={showcase?.title} />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[14px] text-slate">Project</label>
          <select
            name="project_id"
            defaultValue={showcase?.project_id ?? ""}
            className="w-full border border-rule bg-transparent px-4 py-3 outline-none focus-visible:border-brass"
          >
            <option value="">— None —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-[14px] text-slate">Status</label>
          <select
            name="status"
            defaultValue={showcase?.status ?? "draft"}
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

      <Field
        label="Media URL"
        name="media_url"
        type="url"
        placeholder="Link to the image/video — e.g. hosted in Supabase Storage or elsewhere"
        defaultValue={showcase?.media_url ?? ""}
      />

      <TextArea label="Description" name="description" defaultValue={showcase?.description ?? ""} />

      <button
        type="submit"
        className="bg-ink px-6 py-3.5 text-[15px] font-medium text-paper transition-opacity hover:opacity-80"
      >
        {showcase ? "Save changes" : "Create showcase item"}
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
