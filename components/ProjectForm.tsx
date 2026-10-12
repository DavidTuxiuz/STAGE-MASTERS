type Track = { id: string; name: string };
type Project = {
  id: string;
  name: string;
  purpose: string | null;
  brief: string | null;
  objective: string | null;
  audience: string | null;
  output: string | null;
  workflow: string | null;
  quality_criteria: string | null;
  status: string;
};

export default function ProjectForm({
  action,
  tracks,
  project,
  selectedTrackIds = [],
}: {
  action: (formData: FormData) => void;
  tracks: Track[];
  project?: Project;
  selectedTrackIds?: string[];
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[1fr_200px]">
        <Field label="Name" name="name" required defaultValue={project?.name} />
        <div>
          <label className="mb-2 block text-[14px] text-slate">Status</label>
          <select
            name="status"
            defaultValue={project?.status ?? "draft"}
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

      <div>
        <label className="mb-3 block text-[14px] text-slate">Participating tracks</label>
        <div className="grid gap-2.5 border border-rule p-4 md:grid-cols-2">
          {tracks.map((t) => (
            <label key={t.id} className="flex items-center gap-2.5 text-[14.5px]">
              <input
                type="checkbox"
                name="track_ids"
                value={t.id}
                defaultChecked={selectedTrackIds.includes(t.id)}
                className="accent-brass"
              />
              {t.name}
            </label>
          ))}
        </div>
      </div>

      <TextArea label="Purpose" name="purpose" defaultValue={project?.purpose ?? ""} />
      <TextArea label="Brief" name="brief" defaultValue={project?.brief ?? ""} />

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Objective" name="objective" defaultValue={project?.objective ?? ""} />
        <Field label="Audience" name="audience" defaultValue={project?.audience ?? ""} />
      </div>

      <Field label="Output" name="output" defaultValue={project?.output ?? ""} />
      <TextArea label="Workflow" name="workflow" defaultValue={project?.workflow ?? ""} />
      <TextArea label="Quality criteria" name="quality_criteria" defaultValue={project?.quality_criteria ?? ""} />

      <button
        type="submit"
        className="bg-ink px-6 py-3.5 text-[15px] font-medium text-paper transition-opacity hover:opacity-80"
      >
        {project ? "Save changes" : "Create project"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
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
        required={required}
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
