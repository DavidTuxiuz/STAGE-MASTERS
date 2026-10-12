type Resource = { id: string; title: string };
type Practice = {
  id: string;
  name: string;
  skill: string | null;
  level: string | null;
  duration_minutes: number | null;
  instructions: string | null;
  output_requirements: string | null;
  quality_criteria: string | null;
  related_resource_id: string | null;
};

export default function PracticeForm({
  action,
  resources,
  practice,
}: {
  action: (formData: FormData) => void;
  resources: Resource[];
  practice?: Practice;
}) {
  return (
    <form action={action} className="space-y-6">
      <Field label="Name" name="name" required defaultValue={practice?.name} />

      <div className="grid gap-6 md:grid-cols-3">
        <Field label="Skill" name="skill" defaultValue={practice?.skill ?? ""} />
        <div>
          <label className="mb-2 block text-[14px] text-slate">Level</label>
          <select
            name="level"
            defaultValue={practice?.level ?? ""}
            className="w-full border border-rule bg-transparent px-4 py-3 outline-none focus-visible:border-brass"
          >
            <option value="">— Not set —</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <Field
          label="Duration (minutes)"
          name="duration_minutes"
          type="number"
          defaultValue={practice?.duration_minutes ?? ""}
        />
      </div>

      <div>
        <label className="mb-2 block text-[14px] text-slate">Related resource</label>
        <select
          name="related_resource_id"
          defaultValue={practice?.related_resource_id ?? ""}
          className="w-full border border-rule bg-transparent px-4 py-3 outline-none focus-visible:border-brass"
        >
          <option value="">— None —</option>
          {resources.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </div>

      <TextArea label="Instructions" name="instructions" defaultValue={practice?.instructions ?? ""} />
      <TextArea
        label="Output requirements"
        name="output_requirements"
        defaultValue={practice?.output_requirements ?? ""}
      />
      <TextArea label="Quality criteria" name="quality_criteria" defaultValue={practice?.quality_criteria ?? ""} />

      <button
        type="submit"
        className="bg-ink px-6 py-3.5 text-[15px] font-medium text-paper transition-opacity hover:opacity-80"
      >
        {practice ? "Save changes" : "Create practice"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  defaultValue?: string | number;
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
