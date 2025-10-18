export default function StepImage({ index }) {
  return (
    <div className="mt-3 mb-6">
      <img
        src={`https://placehold.co/400x250?text=Bước+${index}`}
        alt={`Bước ${index}`}
        className="rounded-xl w-full object-cover shadow-sm"
      />
    </div>
  );
}
